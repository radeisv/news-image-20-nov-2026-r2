// bake_map.mjs — round 2f. Bakes the user-supplied base-map JPG into
// poster.html as a base64 data URI so the poster stays self-contained
// (no external file reference at render time). Run from the repo root:
//   node bake_map.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
const jpg = join(
  process.env.HOME,
  'workspace/user/media_library/image/global-globalization-world-map-environmental-concservation-concept.jpg'
);
const template = readFileSync(join(root, 'poster/poster.template.html'), 'utf8');
if (!template.includes('__MAP_B64__')) {
  throw new Error('poster template has no __MAP_B64__ placeholder');
}
const b64 = readFileSync(jpg).toString('base64');
const baked = template.replace('__MAP_B64__', `data:image/jpeg;base64,${b64}`);
writeFileSync(join(root, 'poster/poster.html'), baked);
console.log(`baked poster.html (${baked.length} chars; map base64 ${b64.length} chars)`);
