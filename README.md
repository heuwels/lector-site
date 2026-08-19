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
