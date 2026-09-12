# PolicyProbe Web Portal & Verification Ledger

Next.js 16 (App Router) web console and documentation portal for PolicyProbe.

## Getting Started

```bash
cd web
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the portal.

## Production Build

```bash
npm run build
```

## Structure

- `app/`: Next.js 16 App Router pages
  - `/`: Hero, invariant ledger summary, killer demo playground, problem equation, architecture highlights
  - `/proof`: Verification ledger showcasing the 6 onchain ATS bond compliance invariants
  - `/evidence`: HashScan Mirror Node explorer and testnet transaction links
  - `/docs/*`: Technical documentation (Architecture, Recipe Spec, Benchmarks, ADRs, Quickstart)
- `components/`: React components
  - `BrandLogos.tsx`: Official monochrome Hedera and HashScan SVG vectors
  - `PolicyProbeLogo.tsx`: Animated SVG radar/invariant mark
  - `landing/`: ProofPlayground, BentoGrid, PolicyMatrix, TelemetryBar, HowItWorks
  - `docs/`: DocSidebar and navigation
- `public/`: Static vector and raster brand assets
- `PolicyProbe_DESIGN.md`: Complete design system specifications, color palette, and typography

## Developer Guidelines

1. **Design System & Typography**: Follow `PolicyProbe_DESIGN.md`. Uses JetBrains Mono for metrics/code and Inter for copy with dark theme accents.
2. **Branding Integrity**: Use official monochrome marks for Hedera and HashScan (never recolor official partner logos with status badges).
3. **Guardrails**: Do not modify `../fixtures/` or commit any private keys or `.env` files.
