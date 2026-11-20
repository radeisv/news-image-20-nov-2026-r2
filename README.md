# news-image-20261120 — Round 2f

[![make.fun](https://make.fun/badge/news-image-20261120.svg)](https://make.fun/bounty/news-image-20261120?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261120)
[![Rank](https://make.fun/badge/news-image-20261120/radeisv/news-image-20-nov-2026-r2/rank.svg)](https://make.fun/bounty/news-image-20261120/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261120)
[![Reward](https://make.fun/badge/news-image-20261120/radeisv/news-image-20-nov-2026-r2/reward.svg)](https://make.fun/bounty/news-image-20261120?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261120)

"The World in One Day — Friday 20 November 2026". 36 stories (3 leads,
10 modules, 23 briefs), classic three-lead newspaper layout modelled on
the uploaded reference and rank 1, with the user-supplied world map as
the base (Map: world outline; all other illustrations original).

Status: LOCAL BUILD ONLY — not uploaded to GitHub, not submitted.

Round 2f changes exactly ONE thing vs round 2e: the art is richer and
the output is truecolour RGB instead of a 256-colour palette, so the
poster lands near rank 1's ~742KB. Content, layout, pins (including the
3/5 separation fix), chips, DATE CHECK and footer are identical to
round 2e (visible text verified identical).

- `entry.png` — 1024×1024, 727,720 bytes, truecolour RGB,
  sha256 `77c1065f74a4c248bbbd398c6292a7d4f8ebb59c6ca7134287eb6d7d99626b43`
- `main.ts` — entrypoint: republishes the baked `entry.png` bytes.
- `poster/poster.template.html` — poster source (map placeholder
  `__MAP_B64__`); `poster/poster.html` — baked, self-contained version.
- `bake_map.mjs` — bakes the base-map JPG into `poster.html` as base64.
- `poster/render.mjs` — headless-Chrome renderer + RGB PNG encoder.
- `poster/data/stories36.json` — the 36 stories (from round 2e,
  verbatim).
- `BUILD.md` — full build notes, verification and known flaws.
