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
 * colo give geography without identifying anyone.
 */
function recordPull(
  env: Env,
  request: Request,
  repo: string,
  ref: string,
  method: string,
  digest: string,
  bytes: number,
): void {
  const userAgent = (request.headers.get("user-agent") ?? "").slice(0, 256);
  const cf = request.cf;

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
    ],
    doubles: [bytes],
  });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
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
      return await serveManifest(env, request, repo, op.ref);
    } catch (err) {
      console.error("registry proxy failed", { repo, path: pathname, err });
      return registryError(502, "UNAVAILABLE", "Upstream registry error.");
    }
  },
} satisfies ExportedHandler<Env>;

async function serveManifest(
  env: Env,
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
    recordPull(
      env,
      request,
      repo,
      ref,
      request.method,
      upstream.headers.get("docker-content-digest") ?? "",
      Number(upstream.headers.get("content-length") ?? 0),
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
