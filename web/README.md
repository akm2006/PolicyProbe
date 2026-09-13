# PolicyProbe Web Portal & Verification Ledger

Next.js 16 (App Router) web console and documentation portal for PolicyProbe.

## Getting Started

```bash
cd web
npm ci
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the portal.

## Production Build

```bash
npm run build
```

## Structure

- `app/`: Next.js 16 App Router pages
  - `/`: Project overview, recorded-result replay, and the six-policy conformance suite
  - `/proof`: Upstream Harness pull request, deployment reference, and recorded policy results
  - `/evidence`: Normalized testnet evidence summaries with HashScan transaction links
  - `/docs/*`: Technical documentation rendered from `content/docs/`
- `components/`: React components
  - `PolicyProbeLogo.tsx`: Animated SVG radar/invariant mark
  - `landing/`: Homepage sections
  - `docs/`: Documentation navigation
- `content/docs/`: MDX documentation source
- `public/`: Static vector and raster brand assets
- `PolicyProbe_DESIGN.md`: Complete design system specifications, color palette, and typography

## Developer Guidelines

1. **Design System & Typography**: Follow `PolicyProbe_DESIGN.md`. Uses JetBrains Mono for metrics/code and Inter for copy with dark theme accents.
2. **Branding Integrity**: Use official monochrome marks for Hedera and HashScan (never recolor official partner logos with status badges).
3. **Guardrails**: Do not modify `../fixtures/` or commit any private keys or `.env` files.
