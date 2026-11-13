/* Copy audit for the plain-technical-English rule. Run: npm run test:copy
   Reports long sentences, passive forms, filler and metaphoric words in
   player-facing string literals. It is a report, not a hard gate. */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const ROOT = path.resolve(import.meta.dirname, '..');
const sandbox = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(ROOT, 'assets/manifest.js'), 'utf8'), sandbox);
const ids = sandbox.window.ARCADE_GAMES.map(g => g.id);
const files = [
  'index.html', 'assets/host.js', 'assets/manifest.js', 'assets/sdk.js',
  ...ids.map(id => `games/${id}/game.js`)
];
const BANNED = /\b(cabinet|ladder|machines?|journey|voice|handmade|blazing|timetable|soul|magic|heart|whisper|dance|dances|danced|sing|sings|seduce|seductive|seduction| lust |tempt|enchanted|dream|dreams|delight|delightful|alchemy|poem|poetic|plainly|simply|really|very|quite|rather|somewhat|of course|in order to|at the end of the day)\b/i;
const PASSIVE = /\b(is|are|was|were|been|being)\s+[a-z]+(ed|en|wn|nt)\b/i;
const SHORTHAND = /(\bA\/S\b|\bW A S D\b|1-4 views|[A-Z]\/[A-Z]\s)|→|—|…|\.\.\./;
const SKIP = /(#[0-9a-f]{3,8}\b|rgba?\(|\bpx\b|\.js\b|\.png\b|\.svg\b|http|www\.|font-family|Georgia|monospace|serif|sans-serif|\bcenter\b|\bleft\b|\bright\b|\bmiddle\b|\bbold\b|\bitalic\b|\balpha\b|\bsource-over\b|\blighter\b|pointer lock|[?&]|=|\/|\bKey[A-Z]\b|\bArrow[A-Z][a-z]+\b|^[a-z0-9_-]{1,24}$)/i;

function htmlTexts(text) {
  const out = [];
  const re = />([^<>]+)</g;
  let m;
  while ((m = re.exec(text)) !== null) {
    const s = m[1].replace(/\s+/g, ' ').trim();
    if (s.length < 12 || !/[A-Za-z]/.test(s) || /[{};=]/.test(s)) continue;
    out.push({ s, line: text.slice(0, m.index).split('\n').length });
  }
  return out;
}
function strings(text) {
  const out = [];
  const re = /(['"])((?:\\.|(?!\1)[^\\\n])*)\1/g;
  let m;
  while ((m = re.exec(text)) !== null) {
    let s = m[2].replace(/\\n/g, ' ').replace(/\\'/g, "'").replace(/\\"/g, '"');
    if (s.length >= 12 && /[A-Za-z]/.test(s)) out.push({ s, line: text.slice(0, m.index).split('\n').length });
  }
  return out;
}
let total = 0;
const rows = [];
for (const rel of files) {
  const abs = path.join(ROOT, rel);
  if (!fs.existsSync(abs)) continue;
  const text = fs.readFileSync(abs, 'utf8');
  const found = [];
  const items = rel.endsWith('.html') ? strings(text).concat(htmlTexts(text)) : strings(text);
  for (const { s, line } of items) {
    if (SKIP.test(s)) continue;
    const words = s.trim().split(/\s+/).length;
    if (words < 3) continue;
    const reasons = [];
    const clauses = s.split(/(?:\. |! |\? |; )+/).filter(Boolean);
    const longest = Math.max(...clauses.map(c => c.trim().split(/\s+/).length));
    if (longest > 20) reasons.push(`${longest} words in one sentence`);
    if (BANNED.test(s)) reasons.push('metaphor/filler: ' + (s.match(BANNED) || [''])[0]);
    if (PASSIVE.test(s) && !/\b(is|are|was|were|been|being)\s+(open|closed|ready|full|empty|gone|done|fine|clear|awake|alive|alone)\b/i.test(s))
      reasons.push('passive: ' + (s.match(PASSIVE) || [''])[0]);
    if (SHORTHAND.test(s) && !/W A S D|pointer lock/.test(s)) reasons.push('shorthand / dash');
    if (clauses.length === 1 && words > 16) reasons.push(`${words} words in one clause`);
    if (reasons.length) found.push(`L${line} [${reasons.join('; ')}] ${s.slice(0, 130)}`);
  }
  total += found.length;
  rows.push({ file: rel, flags: found.length, examples: found.slice(0, 5) });
}
console.log('THE THIRTEEN — plain-language copy audit');
for (const r of rows) {
  console.log(`\n${r.file}: ${r.flags} flags`);
  for (const e of r.examples) console.log('  ' + e);
}
console.log(`\n${total} flagged strings across ${rows.length} files.`);
if (process.argv.includes('--strict') && total > 0) process.exitCode = 1;
