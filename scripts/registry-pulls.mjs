#!/usr/bin/env node
/**
 * Reports image pulls recorded by the registry proxy (workers/registry).
 *
 *   node scripts/registry-pulls.mjs                  # last 30 days
 *   node scripts/registry-pulls.mjs --days 7
 *   node scripts/registry-pulls.mjs --staging        # the staging dataset
 *   node scripts/registry-pulls.mjs --sql "SELECT ..."
 *
 * Reads the Analytics Engine SQL API, which needs a token carrying
 * "Account Analytics: Read". That is a different permission from the Pages
 * deploy token, so it may need to be a separate one:
 *
 *   export CLOUDFLARE_ACCOUNT_ID=...
 *   export CLOUDFLARE_ANALYTICS_TOKEN=...
 *
 * Analytics Engine keeps 3 months of data. Anything that needs a longer history
 * has to be rolled up and stored elsewhere before it ages out.
 */

const DATASET = "lector_registry_pulls";
const STAGING_DATASET = "lector_registry_pulls_staging";

// Mirrors recordPull() in workers/registry/src/index.ts. The SQL API exposes
// the fields positionally, so this table is the only thing that makes a query
// readable — keep it in step with the Worker.
const COLUMNS = {
  repo: "blob1",
  tag: "blob2",
  method: "blob3",
  client: "blob4",
  userAgent: "blob5",
  country: "blob6",
  colo: "blob7",
  digest: "blob8",
  // A per-day pseudonym, not an identity: the salt behind it is deleted after
  // 48 hours, so it cannot be joined across days even deliberately.
  puller: "blob9",
  bytes: "double1",
};

function parseArgs(argv) {
  const args = { days: 30, staging: false, sql: null };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--days") args.days = Number(argv[++i]);
    else if (argv[i] === "--staging") args.staging = true;
    else if (argv[i] === "--sql") args.sql = argv[++i];
    else {
      console.error(`Unknown argument: ${argv[i]}`);
      process.exit(2);
    }
  }
  if (!Number.isFinite(args.days) || args.days < 1) {
    console.error("--days needs a positive number");
    process.exit(2);
  }
  return args;
}

async function query(sql) {
  const account = process.env.CLOUDFLARE_ACCOUNT_ID;
  const token =
    process.env.CLOUDFLARE_ANALYTICS_TOKEN ?? process.env.CLOUDFLARE_API_TOKEN;

  if (!account || !token) {
    console.error(
      "Set CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_ANALYTICS_TOKEN " +
        "(a token with Account Analytics: Read).",
    );
    process.exit(1);
  }

  const res = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${account}/analytics_engine/sql`,
    {
      method: "POST",
      headers: { authorization: `Bearer ${token}` },
      body: sql,
    },
  );

  const text = await res.text();
  if (!res.ok) {
    console.error(`Query failed (${res.status}): ${text}`);
    process.exit(1);
  }

  const parsed = JSON.parse(text);
  return parsed.data ?? parsed;
}

function table(rows) {
  if (rows.length === 0) {
    console.log("  (no data)");
    return;
  }
  const names = Object.keys(rows[0]);
  const width = Object.fromEntries(
    names.map((name) => [
      name,
      Math.max(name.length, ...rows.map((row) => String(row[name]).length)),
    ]),
  );
  const line = (cells) =>
    "  " + names.map((n) => String(cells[n]).padEnd(width[n])).join("  ");

  console.log(line(Object.fromEntries(names.map((n) => [n, n]))));
  console.log(
    "  " + names.map((n) => "-".repeat(width[n])).join("  "),
  );
  for (const row of rows) console.log(line(row));
}

const args = parseArgs(process.argv.slice(2));
const dataset = args.staging ? STAGING_DATASET : DATASET;
const c = COLUMNS;

// A GET on a tag is a pull; a HEAD on a tag is a client asking whether its copy
// is stale. Both are worth seeing, and conflating them overstates installs.
const since = `timestamp > NOW() - INTERVAL '${args.days}' DAY`;

if (args.sql) {
  console.log(JSON.stringify(await query(args.sql), null, 2));
  process.exit(0);
}

console.log(`\nDataset ${dataset}, last ${args.days} days\n`);

console.log("Pulls per day");
// `distinct_pullers` is the closest thing here to an install count. A pull is
// an attempt, and an auto-updater re-checking a tag it already holds counts as
// one, so the two columns diverge for a reason worth reading. The pseudonym
// only holds within a day, so these numbers cannot be summed across rows.
table(
  await query(`
    SELECT toDate(timestamp) AS day,
           SUM(IF(${c.method} = 'GET', _sample_interval, 0)) AS pulls,
           SUM(IF(${c.method} = 'HEAD', _sample_interval, 0)) AS update_checks,
           COUNT(DISTINCT ${c.puller}) AS distinct_pullers
    FROM ${dataset}
    WHERE ${since}
    GROUP BY day ORDER BY day DESC
    FORMAT JSON`),
);

console.log("\nBy tag (pulls only)");
table(
  await query(`
    SELECT ${c.tag} AS tag, SUM(_sample_interval) AS pulls
    FROM ${dataset}
    WHERE ${since} AND ${c.method} = 'GET'
    GROUP BY tag ORDER BY pulls DESC LIMIT 25
    FORMAT JSON`),
);

console.log("\nBy client");
table(
  await query(`
    SELECT ${c.client} AS client,
           SUM(_sample_interval) AS pulls,
           COUNT(DISTINCT ${c.puller}) AS distinct_pullers
    FROM ${dataset}
    WHERE ${since} AND ${c.method} = 'GET'
    GROUP BY client ORDER BY pulls DESC
    FORMAT JSON`),
);

console.log("\nBy country");
table(
  await query(`
    SELECT ${c.country} AS country, SUM(_sample_interval) AS pulls
    FROM ${dataset}
    WHERE ${since} AND ${c.method} = 'GET'
    GROUP BY country ORDER BY pulls DESC LIMIT 20
    FORMAT JSON`),
);

console.log();
