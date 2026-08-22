# lector-site

The marketing site for Lector. Astro builds a static site to `dist/`.
Cloudflare Pages serves it.

```bash
pnpm install
pnpm dev            # Astro dev server. No API routes.
pnpm build          # Build to dist/
```

## Deployment

CI owns the deployment. Do not deploy from a workstation.

1. A push to `master` starts the `CI` workflow.
2. `CI` success starts the `Deploy to Cloudflare Pages` workflow.
3. The deploy workflow builds one artifact.
4. It deploys that artifact to the `lector-site-staging` project.
5. It tests two staging URLs.
6. It promotes the same artifact to the `lector-site` project.

The artifact holds `dist/` and `functions/`. Cloudflare Pages compiles the
functions from `functions/` at the repository root. An artifact without that
directory deploys the site with no `/api/*` routes.

## API documentation

The `/docs/api/` page renders the OpenAPI document of the Lector app. The page
also serves the raw document at `/openapi.json`. Both read one file:
`src/data/openapi.json`.

The app repository owns that document. To refresh the copy in this repository:

```bash
cd ../lector && npm run gen:openapi   # regenerate it in the app repository
cd ../lector-site && pnpm openapi:sync
pnpm openapi:check                    # compare only. Exit 1 on a difference
```

Commit the copy. Cloudflare Pages builds this repository on its own, so the
build cannot read the app repository.

The document holds only the endpoints that a personal access token can reach.
`src/lib/openapi.ts` groups them by tag and flattens each schema into a field
list. The page needs no JavaScript.

## Language interest list

A reader asks for a language on `/reference-data/` or `/roadmap/`. The site
records the address and the language. Lector emails that reader one time, on
the day the language pack is ready.

| Part | Location |
| --- | --- |
| Form | `src/components/LanguageNotify.astro` |
| Write endpoint | `functions/api/language-requests/index.ts` |
| Counts endpoint | `functions/api/language-requests/counts.ts` |
| Table | `schema.sql` |
| Public site key | `src/data/turnstile.ts` |

### Databases

| Pages project | D1 database |
| --- | --- |
| `lector-site` | `lector-language-requests` |
| `lector-site-staging` | `lector-language-requests-staging` |

Each project binds its database as `DB`. Each project holds the Turnstile
secret as `TURNSTILE_SECRET`.

There is no `wrangler.jsonc` at the repository root, and this is deliberate. A
Pages configuration file makes `wrangler pages deploy dist --project-name=X` an
error. CI needs that flag, because it sends one build to two projects. The
bindings live on each Pages project instead. Set them in the Cloudflare
dashboard, or with the Pages projects REST API.

`wrangler.dev.jsonc` exists for local commands only. Wrangler does not load it
automatically. Pass it with `--config`.

### Local work

```bash
pnpm db:local       # Apply schema.sql to the local database
pnpm dev:api        # Build, then serve dist/ and functions/ on :8788
```

`pnpm dev:api` starts without a Turnstile secret, so it skips the bot check.
To test the bot check, add a test secret from Cloudflare:

```bash
pnpm build
npx wrangler pages dev dist --d1 DB --compatibility-date=2026-04-13 \
  -b TURNSTILE_SECRET=1x0000000000000000000000000000000AA   # always passes
```

Use `2x0000000000000000000000000000000AA` for a secret that always fails. To
render the widget on `localhost`, build with the test site key that matches:

```bash
PUBLIC_TURNSTILE_SITE_KEY=1x00000000000000000000AA pnpm build
```

### Read the list

```bash
pnpm requests:counts   # People per language
pnpm requests:list     # The 200 most recent requests
```

### Ship a language

1. Change the language `status` in `src/data/languages.ts` to `complete`.
2. Read the addresses that still wait for it:

```bash
npx wrangler d1 execute lector-language-requests --remote --command \
  "SELECT email FROM language_requests WHERE language = 'mandarin' \
   AND notified_at IS NULL AND unsubscribed_at IS NULL"
```

3. Send the announcement.
4. Mark those rows as sent:

```bash
npx wrangler d1 execute lector-language-requests --remote --command \
  "UPDATE language_requests SET notified_at = datetime('now') \
   WHERE language = 'mandarin' AND notified_at IS NULL"
```

Step 4 matters. An address that gets no email makes the list worthless, and it
breaks the promise on the form.

To remove a reader who asks to come off the list:

```bash
npx wrangler d1 execute lector-language-requests --remote --command \
  "UPDATE language_requests SET unsubscribed_at = datetime('now') \
   WHERE lower(email) = 'reader@example.com'"
```

### Public counts

`/api/language-requests/counts` returns a language only at 25 people or more.
A small number next to every language reads as an abandoned project. Both
functions hold this threshold as `MIN_PUBLIC_COUNT`. Keep the two values equal.

## Contact form

A reader sends a message on `/contact/`. The site then sends that message by
email to `support@lector.dev`.

| Part | Location |
| --- | --- |
| Form | `src/components/ContactForm.astro` |
| Page | `src/pages/contact/index.astro` |
| Write endpoint | `functions/api/contact.ts` |
| Public site key | `src/data/turnstile.ts` |

Each project holds `RESEND_API_KEY` as a secret. Each project holds
`TURNSTILE_SECRET`. Set the Resend key on both projects:

```bash
npx wrangler pages secret put RESEND_API_KEY --project-name=lector-site-staging
npx wrangler pages secret put RESEND_API_KEY --project-name=lector-site
```

Optional bindings:

| Binding | Default |
| --- | --- |
| `CONTACT_FROM` | `Lector <no-reply@lector.dev>` |
| `CONTACT_TO` | `support@lector.dev` |
| `TURNSTILE_HOSTNAMES` | `lector.dev`, `www.lector.dev`, `lector-site-staging.pages.dev`, `lector-site-avb.pages.dev` |

A production `TURNSTILE_HOSTNAMES` value must not include `localhost` or
`127.0.0.1`.

`pnpm dev:api` starts without a Resend key, so the endpoint returns 503. To
skip the send in local work, pass a dry-run flag:

```bash
pnpm build
npx wrangler pages dev dist --d1 DB --compatibility-date=2026-04-13 \
  -b CONTACT_DRY_RUN=1
```

To test the bot check as well, add the test secret and a local hostname list.
Use the test site key at build time. See the Language interest list above.

## Container registry

GHCR publishes no pull statistics. The Packages REST API reports a version
count but no counter, and the web UI shows none either, so a pull of
`ghcr.io/heuwels/lector` is invisible. `workers/registry/` is a read-only
pull-through proxy that makes pulls countable:

```bash
docker pull registry.lector.dev/lector:1.10.3     # counted
docker pull ghcr.io/heuwels/lector:1.10.3         # works, not counted
```

Both `lector` and `heuwels/lector` resolve. Only repositories in
`ALLOWED_REPOS` are served; everything else gets `NAME_UNKNOWN`, which is what
keeps this from being an open proxy to all of GHCR.

### Image bytes do not pass through the Worker

GHCR answers a blob request with a 307 to a pre-signed
`pkg-containers.githubusercontent.com` URL that needs no credentials. The
Worker resolves that redirect and hands the client the signed URL, so layers
come off GitHub's CDN exactly as before. A 1.7 GiB pull costs about 22 Worker
requests carrying only manifest JSON.

That property is the cost model, so `verify.sh` asserts it after every deploy.
If a blob is ever served inline instead, layer bytes start flowing through the
Worker: at 100 pulls a day that is roughly 5 TiB a month.

The signed URL expires within minutes, so the redirect is returned `no-store`.
A cached `Location` would hand out dead URLs and look like a GHCR outage.

### Deployment

`Deploy registry proxy` owns this Worker, separately from the site. It runs on
a push to `master` that touches `workers/registry/**`, bundles both
environments, deploys to `registry.sandbox.lector.dev`, verifies it, then
promotes to `registry.lector.dev`.

#### Credentials

`CLOUDFLARE_API_TOKEN` exists at both the organisation and the repository
level, with the same name. A repository secret wins over an organisation
secret, so this repository uses its own copy and the organisation one is
inert here. Rotating the organisation secret alone changes nothing for these
workflows.

Uploading the Worker needs **Workers Scripts: Edit**. Attaching
`registry.lector.dev` is a second thing: it creates a hostname on the zone, so
a token that only carries Workers Scripts can upload the script but may be
refused on the route. If a deploy fails that way, either add **Workers Routes:
Edit** to the token, or create the two hostnames once from a workstation, where
`wrangler login` already holds `workers_routes:write` and `ssl_certs:write`:

```bash
pnpm registry:deploy:staging
pnpm registry:deploy
```

After that the hostnames exist and CI only replaces the script. Keep the
`routes` block in `wrangler.jsonc` either way: it is the record of which
hostname serves this Worker.

The first deploy waits on a certificate for a new hostname, which is why the
first probe in `verify.sh` retries for two minutes.

#### Commands

```bash
pnpm registry:dev                  # local, on :8787
pnpm registry:check                # bundle without deploying
pnpm registry:verify               # probe production
FULL_PULL=1 ./workers/registry/verify.sh registry.lector.dev
```

`registry:dev` pins an older compatibility date for the same reason `dev:api`
does: the installed Wrangler's local runtime is older than the date the deploy
targets.

### Read the counts

Pulls land in the `lector_registry_pulls` Analytics Engine dataset, one data
point per tag-addressed manifest read. That is one event per `docker pull`: a
client resolves the tag once and addresses everything after it by digest.
Counting blob requests instead would multiply by layer count and would drop to
zero for a client that already holds the layers.

```bash
export CLOUDFLARE_ACCOUNT_ID=...
export CLOUDFLARE_ANALYTICS_TOKEN=...   # Account Analytics: Read
pnpm registry:pulls                     # last 30 days
pnpm registry:pulls -- --days 7
```

A `GET` on a tag is a pull. A `HEAD` on a tag is a client checking whether its
copy is stale; the report keeps the two apart, because counting both as
installs overstates them. No IP address is stored, matching
`language_requests`; geography comes from country and colo only.

Analytics Engine keeps **3 months**. A longer history has to be rolled up into
D1 before it ages out.
