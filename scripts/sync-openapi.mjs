#!/usr/bin/env node
/**
 * Copies the generated OpenAPI document out of the Lector app repository into
 * this site, where /docs/api/ renders it and /openapi.json serves it.
 *
 *   node scripts/sync-openapi.mjs                    # copy it
 *   node scripts/sync-openapi.mjs --check            # compare only, exit 1 on a difference
 *   node scripts/sync-openapi.mjs --from <path>      # read another checkout
 *
 * The app repository owns the document. Generate it there first:
 *
 *   cd ../lector && npm run gen:openapi
 *
 * The copy is committed, because the site builds on Cloudflare Pages, where the
 * app repository is not present.
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const DEST = join(here, "..", "src", "data", "openapi.json");
const DEFAULT_SOURCE = resolve(
  here,
  "..",
  "..",
  "lector",
  "api",
  "openapi.json",
);

function parseArgs(argv) {
  const args = { check: false, from: DEFAULT_SOURCE };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--check") args.check = true;
    else if (argv[i] === "--from") args.from = resolve(argv[++i] ?? "");
    else if (argv[i].startsWith("--from="))
      args.from = resolve(argv[i].slice("--from=".length));
    else {
      console.error(`Unknown argument: ${argv[i]}`);
      process.exit(2);
    }
  }
  return args;
}

const args = parseArgs(process.argv.slice(2));

if (!existsSync(args.from)) {
  console.error(`Source not found: ${args.from}`);
  console.error("Generate it first: cd ../lector && npm run gen:openapi");
  process.exit(1);
}

const source = readFileSync(args.from, "utf8");

// Fail before writing rather than commit a broken page.
const parsed = JSON.parse(source);
if (!parsed.openapi || !parsed.paths) {
  console.error(`${args.from} is not an OpenAPI document.`);
  process.exit(1);
}

if (args.check) {
  const current = existsSync(DEST) ? readFileSync(DEST, "utf8") : "";
  if (current !== source) {
    console.error(
      "src/data/openapi.json is out of date. Run: node scripts/sync-openapi.mjs",
    );
    process.exit(1);
  }
  console.log(
    `src/data/openapi.json is up to date (${Object.keys(parsed.paths).length} paths).`,
  );
  process.exit(0);
}

writeFileSync(DEST, source);
console.log(
  `Wrote src/data/openapi.json (${Object.keys(parsed.paths).length} paths).`,
);
