/**
 * Pull-through proxy for ghcr.io that counts image pulls.
 *
 * GHCR publishes no pull or download statistics — not in the Packages REST API
 * (the container package schema carries `version_count` but no counter) and not
 * in the web UI. Pointing installs at this Worker instead of ghcr.io directly
 * makes every pull observable.
 *
 *   docker pull registry.lector.dev/lector:1.10.3
 *
 * Bytes do not travel through the Worker. GHCR answers a blob request with a
 * 307 to a pre-signed pkg-containers.githubusercontent.com URL that needs no
 * credentials, so this Worker resolves that redirect and hands the client the
 * signed URL. A 1.7 GiB pull therefore costs ~22 Worker requests carrying only
 * manifest JSON, and the layer bytes come off GitHub's CDN as before. Keeping
 * that property is what `Verify blobs still redirect` in the deploy workflow
 * checks; if it ever regresses, the layers start flowing through the Worker.
 *
 * Only repositories named in ALLOWED_REPOS are served. Without that check this
 * would be an open proxy to every public image on GHCR, which would both skew
 * the counts and put someone else's traffic on our account.
 */

interface Env {
  PULLS: AnalyticsEngineDataset;

  // Holds one random salt per UTC day, written with a TTL so it deletes itself.
  SALTS: KVNamespace;

  // GHCR user or org that owns the images, e.g. "heuwels".
  UPSTREAM_OWNER: string;

  // Comma-separated repository names, relative to UPSTREAM_OWNER.
  ALLOWED_REPOS: string;
}

const REGISTRY = "https://ghcr.io";

// Sent when a client omits Accept. Without the OCI index type in the list, GHCR
// answers a multi-arch tag with a legacy single-arch manifest.
const DEFAULT_ACCEPT = [
  "application/vnd.oci.image.index.v1+json",
  "application/vnd.oci.image.manifest.v1+json",
  "application/vnd.docker.distribution.manifest.list.v2+json",
  "application/vnd.docker.distribution.manifest.v2+json",
].join(",");

// GHCR tokens are opaque ("v1:<repo>:<number>") and the token response carries
// no `expires_in`, so there is no advertised lifetime to honour. Cache for a
// conservative interval and treat a 401 as the real signal to re-mint; see
// `fromUpstream`.
const TOKEN_TTL_MS = 240_000;

// Per-isolate. A cold isolate just mints a new token, which is one extra
// subrequest on the first pull it serves.
const tokenCache = new Map<string, { token: string; expiresAt: number }>();

type Op =
  | { kind: "manifest"; repo: string; ref: string }
  | { kind: "blob"; repo: string; digest: string }
  | { kind: "tags"; repo: string };

/**
 * Splits a /v2/ path into an operation. Repository names contain slashes, so
 * the verb has to be matched from the right rather than by counting segments.
 */
function parsePath(path: string): Op | null {
  const rest = path.slice("/v2/".length);

  const manifest = /^(.+)\/manifests\/([^/]+)$/.exec(rest);
  if (manifest) return { kind: "manifest", repo: manifest[1], ref: manifest[2] };

  const blob = /^(.+)\/blobs\/(sha256:[0-9a-f]{64})$/.exec(rest);
  if (blob) return { kind: "blob", repo: blob[1], digest: blob[2] };

  const tags = /^(.+)\/tags\/list$/.exec(rest);
  if (tags) return { kind: "tags", repo: tags[1] };

  return null;
}

/**
 * Maps a requested repository onto its GHCR path, or null when it is not on the
 * allowlist. Both "lector" and "heuwels/lector" resolve, so the short form can
 * be the documented one without breaking anyone who copies the GHCR path.
 */
function resolveRepo(requested: string, env: Env): string | null {
  const owner = env.UPSTREAM_OWNER;
  const prefix = `${owner}/`;
  const name = requested.startsWith(prefix)
    ? requested.slice(prefix.length)
    : requested;

  const allowed = env.ALLOWED_REPOS.split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);

  return allowed.includes(name) ? `${owner}/${name}` : null;
}

async function ghcrToken(repo: string, force: boolean): Promise<string> {
  const cached = tokenCache.get(repo);
  if (!force && cached && cached.expiresAt > Date.now()) return cached.token;

  const scope = encodeURIComponent(`repository:${repo}:pull`);
  const res = await fetch(`${REGISTRY}/token?service=ghcr.io&scope=${scope}`);
  if (!res.ok) throw new Error(`ghcr token request failed: ${res.status}`);

  const { token } = await res.json<{ token: string }>();
  tokenCache.set(repo, { token, expiresAt: Date.now() + TOKEN_TTL_MS });
  return token;
}

/**
 * Calls GHCR with a pull token, minting a fresh one and retrying once if the
 * cached token has expired. `redirect: "manual"` matters for blobs: following
 * the redirect here would pull the layer through the Worker.
 */
async function fromUpstream(
  repo: string,
  suffix: string,
  method: string,
  accept?: string,
): Promise<Response> {
  let last: Response | undefined;

  for (const force of [false, true]) {
    const headers: Record<string, string> = {
      authorization: `Bearer ${await ghcrToken(repo, force)}`,
    };
    if (accept) headers.accept = accept;

    last = await fetch(`${REGISTRY}/v2/${repo}${suffix}`, {
      method,
      headers,
      redirect: "manual",
    });
    if (last.status !== 401) return last;
  }

  return last!;
}

function registryError(status: number, code: string, message: string): Response {
  return new Response(JSON.stringify({ errors: [{ code, message }] }), {
    status,
    headers: {
      "content-type": "application/json",
      "docker-distribution-api-version": "registry/2.0",
    },
  });
}

// Per-isolate cache of today's salt, so the KV read happens once per isolate
// per day rather than once per pull.
let cachedSalt: { day: string; salt: string } | undefined;

const SALT_TTL_SECONDS = 60 * 60 * 48;

function hex(bytes: Uint8Array): string {
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Today's salt, minted on first use and given a TTL so Cloudflare deletes it.
 * Once it is gone the identifiers it produced cannot be traced back to an IP by
 * anyone, including us: there is no stored salt left to test a guess against.
 * This is the property that makes the scheme worth more than hashing alone.
 *
 * Two colos can mint different salts for the same day, because KV has no
 * compare-and-set. That does not inflate a distinct count on its own — each
 * client still maps to one identifier — but a client whose salt changes
 * mid-day is counted twice. At this volume that is a rounding error on a
 * figure that is an estimate anyway.
 */
async function dailySalt(env: Env): Promise<string> {
  const day = new Date().toISOString().slice(0, 10);
  if (cachedSalt?.day === day) return cachedSalt.salt;

  const key = `salt:${day}`;
  let salt = await env.SALTS.get(key);
  if (!salt) {
    const bytes = new Uint8Array(32);
    crypto.getRandomValues(bytes);
    salt = hex(bytes);
    await env.SALTS.put(key, salt, { expirationTtl: SALT_TTL_SECONDS });
  }

  cachedSalt = { day, salt };
  return salt;
}

/**
 * A per-day pseudonym for the puller, after Plausible's approach: hash the
 * client's address and user agent with a salt that is thrown away daily. No IP
 * address is stored or logged, and because the salt rotates, the same client
 * cannot be followed from one day to the next.
 *
 * The repository goes into the hash so identifiers do not correlate across
 * repositories if more are ever served here.
 */
async function pullerId(
  env: Env,
  request: Request,
  repo: string,
): Promise<string> {
  const address = request.headers.get("cf-connecting-ip") ?? "";
  const userAgent = request.headers.get("user-agent") ?? "";
  const salt = await dailySalt(env);

  const input = new TextEncoder().encode(
    [salt, repo, address, userAgent].join("\u0000"),
  );
  const digest = await crypto.subtle.digest("SHA-256", input);

  // 128 bits is far more than a distinct count over a few thousand rows needs.
  return hex(new Uint8Array(digest).slice(0, 16));
}

// Tags that name a version, like "1.15.0" or "1.15".
const SEMVER = /^\d+\.\d+(\.\d+)?$/;

// Only a three-part tag is immutable. "1.15" is an alias that moves onto each
// new patch, so it has to be resolved like any other moving tag — recording it
// verbatim would hide which patch the client actually received.
const EXACT_SEMVER = /^\d+\.\d+\.\d+$/;

// A digest is immutable, so a resolved version never changes and can be held a
// long time. A miss is cached briefly, so a dev build does not re-walk the tag
// list on every pull.
const VERSION_TTL_SECONDS = 60 * 60 * 24 * 30;

// A digest with no version tag today could gain one later, if a release is cut
// from exactly that build. A day is short enough to pick that up and long
// enough that frequent master builds do not re-walk the tag list hourly.
const UNRESOLVED_TTL_SECONDS = 60 * 60 * 24;

// Bounds the subrequests one resolution can make. In practice a moving tag
// points at the newest release, so the first candidate usually matches.
const MAX_VERSION_CANDIDATES = 24;

// Per-isolate, in front of the Cache API.
const versionMemo = new Map<string, string>();

function semverKey(tag: string): number[] {
  const parts = tag.split(".").map(Number);
  // A two-part tag like "1.15" is an alias that moves; the three-part tag it
  // currently points at is the more useful answer, so it sorts first.
  return [parts[0], parts[1], parts[2] ?? -1];
}

function newestFirst(a: string, b: string): number {
  const [x, y] = [semverKey(a), semverKey(b)];
  for (let i = 0; i < 3; i++) if (x[i] !== y[i]) return y[i] - x[i];
  return 0;
}

/**
 * The release behind a moving tag.
 *
 * The image carries no version anywhere — no OCI labels, nothing in its config
 * blob — so the only way to learn which release a tag points at is to find the
 * version tag that resolves to the same digest. Recording just the tag leaves
 * every pull reading "latest", which says nothing about what people run.
 *
 * Not every digest has a version. `latest` currently tracks `master`, and a
 * build straight off master has no release tag at all, so those resolve to
 * "@<short digest>" rather than to nothing: an unreleased build is a fact worth
 * seeing in a report, and a blank column hides it.
 *
 * Runs inside the deferred recording path, and only on a digest this colo has
 * not seen — about once per release, or once per master build.
 */
async function resolveVersion(
  repo: string,
  ref: string,
  digest: string,
): Promise<string> {
  // The tag already names an exact version; nothing to look up.
  if (EXACT_SEMVER.test(ref)) return ref;
  if (!digest) return "";

  const memo = versionMemo.get(digest);
  if (memo !== undefined) return memo;

  // Keyed on a synthetic URL; the Cache API needs a request, not a bare string.
  const key = new Request(
    `https://registry.invalid/version/${encodeURIComponent(repo)}/${digest}`,
  );
  const hit = await caches.default.match(key);
  if (hit) {
    const cached = await hit.text();
    versionMemo.set(digest, cached);
    return cached;
  }

  let version = "";
  try {
    const listing = await fromUpstream(repo, "/tags/list", "GET");
    if (listing.ok) {
      const { tags } = await listing.json<{ tags?: string[] }>();
      const candidates = (tags ?? [])
        .filter((tag) => SEMVER.test(tag))
        .sort(newestFirst)
        .slice(0, MAX_VERSION_CANDIDATES);

      for (const tag of candidates) {
        const head = await fromUpstream(
          repo,
          `/manifests/${tag}`,
          "HEAD",
          DEFAULT_ACCEPT,
        );
        if (head.headers.get("docker-content-digest") === digest) {
          version = tag;
          break;
        }
      }
    }
  } catch (err) {
    // A pull must never depend on this working.
    console.error("resolving a version failed", { repo, digest, err });
  }

  const resolved = version || `@${digest.replace("sha256:", "").slice(0, 12)}`;
  versionMemo.set(digest, resolved);
  await caches.default.put(
    key,
    new Response(resolved, {
      headers: {
        "cache-control": `max-age=${
          version ? VERSION_TTL_SECONDS : UNRESOLVED_TTL_SECONDS
        }`,
      },
    }),
  );
  return resolved;
}

/** Coarse client family, so queries can separate CI from people. */
function clientKind(userAgent: string): string {
  const ua = userAgent.toLowerCase();
  // Order matters: BuildKit and containerd both mention Docker in their UA.
  if (ua.includes("containerd")) return "containerd";
  if (ua.includes("buildkit")) return "buildkit";
  if (ua.includes("kaniko")) return "kaniko";
  if (ua.includes("podman") || ua.includes("libpod")) return "podman";
  if (ua.includes("skopeo")) return "skopeo";
  if (ua.includes("oras")) return "oras";
  if (ua.includes("docker")) return "docker";
  if (ua.includes("curl") || ua.includes("wget")) return "cli";
  return "other";
}

/**
 * Records one pull. Called only for tag-addressed manifest reads, which is
 * exactly one event per `docker pull`: a client resolves the tag once, then
 * addresses everything after that by digest. Counting blob requests instead
 * would multiply by layer count and drop to zero for a warm client.
 *
 * No IP address is stored, matching the language-interest table. Country and
 * colo give geography without identifying anyone, and `pullerId` carries a
 * pseudonym that expires daily so distinct pullers can be counted without
 * keeping anything that identifies them.
 */
async function recordPull(
  env: Env,
  request: Request,
  repo: string,
  ref: string,
  method: string,
  digest: string,
  bytes: number,
): Promise<void> {
  const userAgent = (request.headers.get("user-agent") ?? "").slice(0, 256);
  const cf = request.cf;
  const puller = await pullerId(env, request, repo);
  const version = await resolveVersion(repo, ref, digest);

  env.PULLS.writeDataPoint({
    // The sampling key. Low cardinality on purpose.
    indexes: [repo],
    blobs: [
      repo,
      ref,
      // HEAD is an update check ("is my tag stale?"), GET is a real fetch.
      method,
      clientKind(userAgent),
      userAgent,
      (cf?.country as string) ?? "",
      (cf?.colo as string) ?? "",
      digest,
      puller,
      version,
    ],
    doubles: [bytes],
  });
}

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext,
  ): Promise<Response> {
    const url = new URL(request.url);
    const { pathname } = url;

    if (request.method !== "GET" && request.method !== "HEAD") {
      // This proxy is read-only; pushes go to ghcr.io directly.
      return registryError(405, "UNSUPPORTED", "This registry is read-only.");
    }

    // The version check. Answering 200 keeps clients anonymous: a 401 here
    // would send them to a /token endpoint, and the token they came back with
    // would be ours rather than GHCR's. Nothing here is private, so the
    // simplest correct answer is "no auth needed".
    if (pathname === "/v2" || pathname === "/v2/") {
      return new Response("{}", {
        headers: {
          "content-type": "application/json",
          "docker-distribution-api-version": "registry/2.0",
        },
      });
    }

    // Some clients ask for a token regardless of the check above. Hand back a
    // placeholder so they proceed instead of failing the pull.
    if (pathname === "/token") {
      return new Response(
        JSON.stringify({ token: "anonymous", expires_in: 300 }),
        { headers: { "content-type": "application/json" } },
      );
    }

    if (!pathname.startsWith("/v2/")) {
      // Anything else on this host is a person who followed a link, not a
      // registry client.
      return Response.redirect("https://lector.dev/", 302);
    }

    const op = parsePath(pathname);
    if (!op) return registryError(404, "UNSUPPORTED", "Unsupported endpoint.");

    const repo = resolveRepo(op.repo, env);
    if (!repo) {
      return registryError(
        404,
        "NAME_UNKNOWN",
        `Repository ${op.repo} is not served here.`,
      );
    }

    try {
      if (op.kind === "blob") return await serveBlob(repo, op.digest, request);
      if (op.kind === "tags") return await serveTags(repo, op.repo);
      return await serveManifest(env, ctx, request, repo, op.ref);
    } catch (err) {
      console.error("registry proxy failed", { repo, path: pathname, err });
      return registryError(502, "UNAVAILABLE", "Upstream registry error.");
    }
  },
} satisfies ExportedHandler<Env>;

async function serveManifest(
  env: Env,
  ctx: ExecutionContext,
  request: Request,
  repo: string,
  ref: string,
): Promise<Response> {
  const accept = request.headers.get("accept") ?? DEFAULT_ACCEPT;
  const upstream = await fromUpstream(
    repo,
    `/manifests/${ref}`,
    request.method,
    accept,
  );

  const headers = new Headers({
    "docker-distribution-api-version": "registry/2.0",
  });
  for (const name of [
    "content-type",
    "content-length",
    "docker-content-digest",
    "etag",
  ]) {
    const value = upstream.headers.get(name);
    if (value) headers.set(name, value);
  }

  // A tag is the install signal; a digest is the same pull continuing.
  if (upstream.ok && !ref.startsWith("sha256:")) {
    // Deferred: hashing needs the day's salt, and a KV read should never sit in
    // front of a pull. A failure here must not fail the pull either.
    ctx.waitUntil(
      recordPull(
        env,
        request,
        repo,
        ref,
        request.method,
        upstream.headers.get("docker-content-digest") ?? "",
        Number(upstream.headers.get("content-length") ?? 0),
      ).catch((err) => console.error("recording a pull failed", err)),
    );
  }

  // Manifests are a few KB, so passing the body through costs nothing.
  return new Response(
    request.method === "HEAD" ? null : upstream.body,
    { status: upstream.status, headers },
  );
}

async function serveBlob(
  repo: string,
  digest: string,
  request: Request,
): Promise<Response> {
  // GHCR answers HEAD with the size directly and no redirect, so there is
  // nothing to hand off; forward the headers.
  if (request.method === "HEAD") {
    const head = await fromUpstream(repo, `/blobs/${digest}`, "HEAD");
    const headers = new Headers();
    for (const name of [
      "content-type",
      "content-length",
      "docker-content-digest",
      "etag",
    ]) {
      const value = head.headers.get(name);
      if (value) headers.set(name, value);
    }
    return new Response(null, { status: head.status, headers });
  }

  const upstream = await fromUpstream(repo, `/blobs/${digest}`, "GET");
  const location = upstream.headers.get("location");

  if (upstream.status >= 300 && upstream.status < 400 && location) {
    // The signed URL expires in minutes, so it must never be cached. Serving a
    // stale Location would break pulls in a way that looks like a GHCR outage.
    return new Response(null, {
      status: 307,
      headers: { location, "cache-control": "no-store" },
    });
  }

  // GHCR served the bytes inline instead of redirecting. Streaming them keeps
  // pulls working, but it puts layer traffic through the Worker, so it is worth
  // noticing in the logs.
  if (upstream.ok) {
    console.warn("blob served inline rather than redirected", { repo, digest });
    return upstream;
  }

  return registryError(upstream.status, "BLOB_UNKNOWN", "Blob unavailable.");
}

async function serveTags(repo: string, requested: string): Promise<Response> {
  const upstream = await fromUpstream(repo, "/tags/list", "GET");
  if (!upstream.ok) {
    return registryError(upstream.status, "NAME_UNKNOWN", "No tag list.");
  }

  // GHCR reports its own name ("heuwels/lector"). Echoing that back when the
  // client asked for "lector" contradicts the request, so the name is rewritten
  // to whatever the client used.
  const listing = await upstream.json<{ name: string; tags: string[] }>();
  return new Response(
    JSON.stringify({ name: requested, tags: listing.tags ?? [] }),
    {
      headers: {
        "content-type": "application/json",
        "docker-distribution-api-version": "registry/2.0",
      },
    },
  );
}
