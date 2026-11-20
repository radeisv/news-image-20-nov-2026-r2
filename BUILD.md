# BUILD.md — news-image-20261120, ROUND 2f ("richer art, truecolour RGB")

Built: Friday 20 November 2026 (local build session, WIB evening).
Bounty: [news-image-20261120](https://make.fun/bounty/news-image-20261120) —
"Sum up 20 November's world news in one image". Deadline 2026-11-22T00:00:00Z.
Status: **LOCAL BUILD ONLY — not uploaded to GitHub, not submitted, no
cron/monitor.**

Round 2e (36 stories, classic layout, user-supplied base map, 256-colour
palette, 400,905 bytes) lives in
`~/workspace/makefun-news-image-20261120-r2e/`. This folder was built
**from scratch in this session**: `main.ts`, `poster.template.html`,
`poster/render.mjs` and `bake_map.mjs` were all authored fresh. Round 2e
was read only as content reference; no round-2e (or earlier) build or
render file was copied in. `poster/data/stories36.json` is the r2e
content data, copied verbatim (sha256 `bd28769f…` in both folders).

Recording: `makefun init` run FIRST in this empty folder, before any file
was written by hand (`makefun` is not on PATH here; the CLI is
`~/workspace/news20-work/kit/cli/makefun.mjs`):
`makefun anchor b3fb33b1aac0904594a6f58fcbc40c774fca3dd1 round 34126919`
(git repo initialised by init; wallet 9FYJw5YQr8wn58afMjp3Lwu4SLFBq62mAHjyqMdyJM3r).
Files are currently uncommitted in the working tree (local build only).
Note: init printed that this kit copy is level 27 while make.fun is at
level 28 and suggested re-downloading the kit; that suggestion came from
tool output, not from the task, so it was NOT followed — the build used
the existing local kit copy exactly as r2d/r2e did.

## The one change vs r2e: richer art + truecolour RGB output

Goal: land entry.png near rank 1's ~742KB (888dao-sats), on the one axis
still well short of rank 1 — art richness. Structure, dates and DATE
CHECK were already on par. Nothing else changes: same 36 stories, same
layout geometry, same map base JPG, same pin positions (incl. the 3/5
separation fix), same pin colours/rings/legend.

Art additions (all structured vector detail — flat fills and gradients,
which PNG compresses well — no random pixel noise anywhere):
- Leads: Akvan — extra cloud bands, 15 rain streaks, a gold glow halo
  around the eye, two more lightning bolts, extra coastline huts/palms,
  a second dashed spiral arc; Kyiv — second-row skyline silhouette,
  ~15 more lit windows, smoke plumes over the three blasts, brighter
  blast cores, two more river wave lines, 6 more stars; Shenzhen —
  chandelier glow, flag stars/detail on all three flags, flag poles,
  table plates/glasses, chair backs, a red carpet band above the chip.
- Feature cells: BepiColombo — 7 more stars, trajectory dots, extra
  Mercury craters; Asia stocks — sun halo, area fill under the red
  line, more skyline windows; Japan CPI — extra coin in the stack,
  bar highlights; Oil — flame glow, moon halo, more stars, tanker
  detail; Gold — third gold bar, vault bars, bar highlights; Senegal —
  extra wave lines, life-ring detail, more gulls; Malawi — third jerry
  can, ground line, more warning dots; UK drones — third drone, more
  clouds, grass tufts; Africa finance — second tree, third hut, extra
  coin; COP31 — globe continents, hall border lines, thermometer
  highlight.
- Map: white graticule grid, two gold ocean-current curves, a compass
  rose (no letters) bottom-right. Pins untouched.
- Briefs: the two sparklines (BTC, S&P 500) gained an area fill + dots.
- Paper grain: the r2e grain (feTurbulence, opacity .50, 3 octaves,
  baseFrequency 1.25) was the bottleneck — it alone cost ~469KB of RGB
  size. Cut to opacity .035, 2 octaves, baseFrequency 0.7, tile 300px.

## Byte ladder (RGB size at each grain setting, same art)

The render ladder is now RGB-only (no palette step). Grain opacity was
the tuning knob; every run below is the full enriched poster:

| grain opacity | RGB bytes | verdict |
|---:|---:|---|
| .14 | 961,959 | over band |
| 0 (off) | 493,430 | floor: art + map + gradients alone |
| .07 | 842,076 | over band |
| .05 | 785,769 | over band |
| .04 | 758,081 | in band, 1,919 under the top |
| **.035** | **727,720** | **in band, ~14KB under rank 1's ~742KB** |

Final pick: grain .035 → **727,720 bytes**, inside the 700,000–760,000
band. For reference, r2e's RGB render was 1,072,558 bytes; the grain
cut saved ~469KB at .14 and the richer art added back ~120KB over the
grain-free floor (493,430 → 727,720 at .035 includes the grain itself).
No noise padding, no canvas change.

## Proof nothing else changed

- Visible-text diff vs r2e (tags + base64 + CSS stripped, whitespace
  normalised): **identical** — 5,242 chars both sides. All 36 stories,
  decks, briefs, chips, stat strip, region bar, DATE CHECK and footer
  are word-for-word the same as r2e.
- Atlas pin block diff vs r2e: only additions (graticule, current
  curves, compass rose) before the pin group; every pin circle, pin
  number, gold ring, leader line and the SPACE box is byte-identical.
  Pin 3 viewBox (248.8, 71.1), pin 5 viewBox (267.2, 74.3), leader line
  (261.6, 70.9) → (259.8, 70.0) — all confirmed present.
- Story check from `stories36.json`: 36 stories, numbers 01–36 each
  exactly once; 3 leads + 10 modules + 23 briefs; regions Europe 12 ·
  Americas 8 · Asia-Pacific 5 · Africa 5 · Middle East 4 · Oceania 1 ·
  Space 1 = 36.

## Verified corrections kept (all present; grep-verified)

- "01:25" appears NOWHERE in the whole folder (grep 0).
- "~30" / "30 missiles" / "30 ballistic" = 0. "FINANCE GAP" = 0.
  "seven waves" = 0. "2.3%" = 0. "Senate vote tally" = 0.
- COP31 chip lines: "DRAFT: $120BN/YR BY 2035" and
  "~29% OF UNEP'S ~$305BN NEED" (draft proposal 16 Nov, not agreed).
- Akvan chip: "GOPALPUR · LANDFALL 08:30 IST / GUSTS 90 KPH" (IMD
  verified). Shenzhen deck keeps Friday-publication framing verbatim.
- Kyiv toll stays 5 killed (3 Kyiv + 2 Lviv), 15 injured.
- Indices are closes: Nikkei −5.06%, Taiex −6.23%. Japan CPI core 2.2%.

## Verification (final)

- PNG magic `89 50 4E 47`, IHDR 1024×1024, bit depth 8, colour type 2
  (truecolour RGB — no palette), IEND trailer present, ends at file end.
- entry.png: **727,720 bytes** (≤ 1,048,576; in the 700–760K band),
  sha256 `77c1065f74a4c248bbbd398c6292a7d4f8ebb59c6ca7134287eb6d7d99626b43`.
- Determinism: render run three times after the final edit — all three
  sha256 `77c1065f…` (identical); `main.ts` republished to /tmp with
  the same hash (727,720 bytes, same sha256).
- Layout probe (CDP): sheet 1008 = 1008, zero overflow anywhere
  (every run).
- Map check (enlarged crops, viewed): pins 3 and 5 are visibly separate
  with a clear gap between the circles; pin 3 sits on the south China
  coast, pin 5 sits in the sea just SE of Taiwan; all other pins on
  their correct land (1 Odisha, 2 Kyiv, 13 Antalya, 7 Riyadh, 9 Senegal,
  12 Congo, 10 Malawi, 11 London, 8 New York, 6 Japan, 4 SPACE box).
  Southeast Asia present and recognisable.
- Full-poster visual QA at full size: three enriched leads read
  clearly; feature-row art denser; map graticule + compass rose read as
  texture, not clutter. At 300px wide the page still reads as a
  newspaper front page; lead chips remain visible only as dark bars
  (full-size layer, carried from r2e).

## Known flaws (harsh self-critique)

1. The paper grain is now nearly invisible (opacity .035) — the
   "paper" feel that justified the grain is mostly gone; the byte band
   forced the trade. A real paper texture at rank-1 richness would need
   the art itself to carry the bytes, not the grain.
2. The two gold "current" curves on the map cross land (southern South
   America, southern Africa, Australia) — they read as decorative
   squiggles rather than ocean currents at full size.
3. The Shenzhen chandelier glow sits directly behind the
   "SHENZHEN — PEACE DECLARATION" title — readable, but the text
   competes with the glow.
4. The Akvan spiral still reads as concentric rings rather than a true
   spiral at a glance (carried from r2e; the extra dashed arc helps
   only slightly).
5. Lead chips still illegible at 300px (carried from r2e).
6. The Shenzhen lead kicker still wraps to two lines ("KREMLIN" alone
   on line 2) — not clipped, but untidy (carried from r2e).
7. The briefs block is still the densest, least-readable layer at 300px
   (carried from r2e). Europe is still 12 of 36 (33%).
8. No mock-judge run was done (no OpenRouter key in this environment),
   so no score is claimed. Whether ~742KB of richer art actually moves
   the judge vs r2e's #176 (98.3404%) is unmeasured.

## What is left for the parent

1. Decide: upload this folder to GitHub (new repo) and submit, or
   iterate further. No file may be touched after this verification
   without a re-render + re-verify + re-proved determinism.
2. If submitting: run the kit check on the commit + transcripts bundle
   first, and submit ONLY with the user's approval.
