# portfolio

Personal portfolio site. The centrepiece is the **Metal Bloom**: a procedurally
generated metal flower rendered in real time with Three.js, which unfurls as you
arrive and opens further as you scroll.

## Stack

- [Vite](https://vite.dev) + [React 19](https://react.dev) + TypeScript
- [Three.js](https://threejs.org) via [React Three Fiber](https://r3f.docs.pmnd.rs) and [drei](https://drei.docs.pmnd.rs)
- [Leva](https://github.com/pmndrs/leva) for the design lab controls
- CSS Modules with design tokens in `src/styles/tokens.css`

## Getting started

```bash
npm install
npm run dev        # http://localhost:5173
```

Other scripts:

```bash
npm run build      # typecheck + production build to dist/
npm run preview    # serve the production build
npm run lint       # eslint
npm run typecheck  # tsc
npm run format     # prettier
```

## Deployment

The site is deployed to Cloudflare Workers (static assets) at
[katarinarankovic.fyi](https://katarinarankovic.fyi). Configuration lives in
`wrangler.jsonc`; `public/_headers` and `public/_redirects` are copied into
`dist/` and applied at the edge (long-lived caching for hashed assets, `www` →
apex redirect).

- **CI:** every push to `main` runs `.github/workflows/deploy.yml`, which
  lints, builds and runs `wrangler deploy`. It needs two repository secrets:
  `CLOUDFLARE_API_TOKEN` (a token with the _Workers Scripts: Edit_, _Workers
  Routes: Edit_ and _DNS: Edit_ permissions on the zone) and
  `CLOUDFLARE_ACCOUNT_ID`.
- **Manual:** `npm run deploy` with the same two variables exported (or after
  `npx wrangler login`). `npm run deploy:check` does a dry run.

The custom-domain routes in `wrangler.jsonc` make Wrangler create the DNS
records for `katarinarankovic.fyi` and `www.katarinarankovic.fyi` automatically
on the first deploy, provided the zone is in the same Cloudflare account.

## Project layout

```
src/
  app/          App shell and hash routing (home / #/lab)
  bloom/        The Metal Bloom: geometry, layout, materials, lighting, R3F components
  components/   Site UI (nav, hero, sections)
  content/      All copy in one place (src/content/site.ts)
  lab/          Bloom design lab at #/lab
  pages/        Page compositions
  styles/       Tokens and global styles
```

## The Metal Bloom

Everything about the flower is generated at runtime from a small config
(`BloomConfig` in `src/bloom/presets.ts`); there are no imported meshes.

- `petalGeometry.ts` evaluates a parametric petal surface (width profile,
  recurve, cupping, twist, rim ripple), then extrudes it into a **closed shell
  with real thickness** and a crisp rim so it reads as cut metal rather than a
  textured plane. A second, furled "bud" shape with identical topology is stored
  as a morph target.
- `bloomLayout.ts` places petals on a **golden-angle spiral** (spiral
  phyllotaxis). Radius, height, scale, tilt and petal shape all vary
  continuously from the innermost to the outermost petal, and opening is
  staggered so outer petals lead.
- `MetalBloom.tsx` drives it: for a global `bloom` value in `[0, 1]` each petal
  both rotates open and morphs from bud to open shape.
- `StudioEnvironment.tsx` is a procedural studio light rig baked to an
  environment map (no HDR download), designed to give long highlights along the
  petals.
- `presets.ts` holds the candidate directions (`ROSE`, `LOTUS`, `DAHLIA`) and
  the metal finishes (`chrome`, `brass`, `titanium`, `gunmetal`, `rose-gold`).

### Design lab

Open `#/lab` (linked from the footer) to switch directions, change the finish
and tune every geometric, layout and material parameter live. "Copy config
JSON" exports the current state; paste it into `presets.ts` to make it the
shipped preset.
