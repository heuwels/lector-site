// Report every place a word butts straight against an inline tag in the built
// site, for the tags that carry running text.
//
// Excluded on purpose:
//  * <span>, which this site uses for layout (a flex row supplies its own gap,
//    and a `block` span is not inline at all).
//  * `(` after a closing tag, which is how a journal citation prints a volume.
//  * HTML comments, because two blog posts quote the bug deliberately.
import { readFileSync, globSync } from "node:fs";

const INLINE = "a|code|em|strong|abbr|b|i";
const OPEN = new RegExp(`([A-Za-z0-9.,;:?!)'"”’]{1,30})<(${INLINE})[\\s>]`, "g");
const CLOSE = new RegExp(`</(${INLINE})>([A-Za-z0-9][^<]{0,28})`, "g");
const COMMENT = /<!--[\s\S]*?-->/g;

let total = 0;

for (const file of globSync("dist/**/index.html").sort()) {
  const body = readFileSync(file, "utf8").split("<footer", 1)[0].replace(COMMENT, " ");
  const hits = [];
  for (const m of body.matchAll(OPEN)) hits.push(`open  <${m[2]}> after "${m[1].slice(-26)}"`);
  for (const m of body.matchAll(CLOSE)) hits.push(`close </${m[1]}> before "${m[2].slice(0, 26)}"`);
  if (hits.length) {
    console.log(`${file}  (${hits.length})`);
    for (const h of hits) console.log(`   ${h}`);
  }
  total += hits.length;
}

console.log(`total: ${total}`);
