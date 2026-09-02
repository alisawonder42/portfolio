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
`wrangler.jsonc` (including the account id, which is not secret).
`public/_headers` is copied into `dist/` and applied at the edge (long-lived
caching for hashed assets, basic security headers). `worker/index.ts` is a
few-line edge script that redirects `www.` to the apex and otherwise serves the
static assets; static `_redirects` cannot express cross-host redirects.

- **CI:** every push to `main` runs `.github/workflows/deploy.yml`, which
  lints, builds and runs `wrangler deploy`. It needs one repository secret,
  `CLOUDFLARE_API_TOKEN`: a custom token with _Account → Workers Scripts:
  Edit_. The production domains have already been attached to the Worker
  service, so ordinary code deployments do not need DNS or Routes access.
- **Manual:** `npm run deploy` with `CLOUDFLARE_API_TOKEN` exported (or after
  `npx wrangler login`). `npm run deploy:check` does a dry run.
- **Preview:** `npm run deploy:preview` publishes to a `*.workers.dev` URL
  without touching the custom domain. Add `-- --temporary` to deploy to a
  throwaway Cloudflare account with no login at all (expires after an hour
  unless claimed).

The apex and `www` custom domains are attached to the `katarinarankovic-fyi`
Worker through Cloudflare's Workers Domains API. That association persists
across deployments; it is intentionally not duplicated in `wrangler.jsonc`,
because Wrangler otherwise requires permission to enumerate legacy Worker
Routes on every deploy.

`.cursor/mcp.json` registers Cloudflare's MCP servers so Cloud Agents working
on this repo can inspect the account (Workers, builds, logs) once the MCP is
authorised.

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
