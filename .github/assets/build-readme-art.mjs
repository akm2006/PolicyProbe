#!/usr/bin/env node
// Renders the README artwork in the website's design language, in light and dark variants.
// Light uses the marketing-site palette and dark uses the docs dark palette (web/app/globals.css).
// Instrument Sans and JetBrains Mono are fetched from Google Fonts, subset to the glyphs each SVG
// uses, and embedded so the artwork matches the site; system fonts remain the fallback.
//
// Usage, from the repository root:
//   npm install --no-save subset-font
//   node .github/assets/build-readme-art.mjs
import { writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const OUT = dirname(fileURLToPath(import.meta.url));
// FONT_TOOLS_DIR lets subset-font resolve from an install outside the repository.
const require = createRequire(
  process.env.FONT_TOOLS_DIR ? join(process.env.FONT_TOOLS_DIR, 'index.js') : import.meta.url,
);
const subsetFont = require('subset-font');

// ── Color: the site's oklch tokens, converted to hex for broad SVG support ──────────────────────

function oklch(L, C, H) {
  const h = (H * Math.PI) / 180;
  const a = C * Math.cos(h);
  const b = C * Math.sin(h);
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  const linear = [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
  return `#${linear
    .map((c) => {
      const v = c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055;
      return Math.round(Math.min(1, Math.max(0, v)) * 255).toString(16).padStart(2, '0');
    })
    .join('')}`;
}

function mix(from, to, amount) {
  const parse = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  const a = parse(from);
  const b = parse(to);
  return `#${a.map((v, i) => Math.round(v + (b[i] - v) * amount).toString(16).padStart(2, '0')).join('')}`;
}

function siteTheme() {
  const bg = oklch(0.985, 0.002, 90);
  const fg = oklch(0.12, 0.01, 60);
  return {
    bg, fg,
    card: oklch(1, 0, 0),
    muted: oklch(0.45, 0.02, 60),
    border: oklch(0.88, 0.01, 90),
    pass: oklch(0.6, 0.13, 155),
    fail: oklch(0.577, 0.245, 27.325),
    warn: oklch(0.769, 0.188, 70.08),
    logo: { ink: '#1c1917', observed: '#6b645c' },
    // "How it works" is an inverted ink section on the site.
    panel: { bg: fg, text: bg },
  };
}

function docsDarkTheme() {
  const bg = oklch(0.145, 0.003, 60);
  const fg = oklch(0.96, 0.003, 90);
  const card = oklch(0.175, 0.003, 60);
  return {
    bg, fg, card,
    muted: oklch(0.7, 0.01, 60),
    border: mix(bg, '#ffffff', 0.1),
    pass: oklch(0.72, 0.14, 155),
    fail: oklch(0.68, 0.2, 27),
    warn: oklch(0.769, 0.188, 70.08),
    logo: { ink: '#faf9f6', observed: '#a8a29e' },
    panel: { bg: card, text: fg },
  };
}

const THEMES = { light: siteTheme(), dark: docsDarkTheme() };

// ── Fonts ────────────────────────────────────────────────────────────────────────────────────────

const GOOGLE_FONTS_CSS =
  'https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400..700&family=JetBrains+Mono:wght@400..700&display=swap';
const FONTS = { 'PP Sans': 'Instrument Sans', 'PP Mono': 'JetBrains Mono' };
let fontFiles;

async function loadFonts() {
  // Google Fonts only serves woff2 to modern user agents.
  const headers = {
    'user-agent':
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36',
  };
  const css = await (await fetch(GOOGLE_FONTS_CSS, { headers })).text();
  const latinBlocks = css
    .split('/* latin */')
    .slice(1)
    .map((chunk) => chunk.slice(0, chunk.indexOf('}')));
  const files = {};
  for (const [alias, family] of Object.entries(FONTS)) {
    const url = latinBlocks.find((block) => block.includes(`'${family}'`))?.match(/url\(([^)]+)\)/)?.[1];
    if (!url) throw new Error(`No latin woff2 for ${family} in the Google Fonts response`);
    files[alias] = Buffer.from(await (await fetch(url)).arrayBuffer());
  }
  return files;
}

async function fontFaces(text) {
  fontFiles ??= await loadFonts();
  const faces = await Promise.all(
    Object.entries(fontFiles).map(async ([alias, file]) => {
      const woff2 = await subsetFont(file, text, { targetFormat: 'woff2' });
      return `@font-face { font-family: '${alias}'; font-weight: 400 700; src: url(data:font/woff2;base64,${woff2.toString('base64')}) format('woff2'); }`;
    }),
  );
  return faces.join('\n  ');
}

// ── Shared building blocks ───────────────────────────────────────────────────────────────────────

async function svg({ w, h, title, css = '', body, fonts = true }) {
  const glyphs = `${title} ${body.replace(/<[^>]+>/g, '')}`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" fill="none" role="img" aria-label="${title}">
<title>${title}</title>
<style>
  ${fonts ? await fontFaces(glyphs) : ''}
  .sans { font-family: 'PP Sans', 'Instrument Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif; }
  .mono { font-family: 'PP Mono', 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; }
  .dash { stroke-dasharray: 3 6; animation: dash 1.2s linear infinite; }
  @keyframes dash { to { stroke-dashoffset: -18; } }
  .pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
  @keyframes pulse { 50% { opacity: 0.5; } }${css}
  @media (prefers-reduced-motion: reduce) { * { animation: none !important; } }
</style>
${body}
</svg>
`;
}

const round = (n) => Math.round(n * 10) / 10;

// Site surface: flat ground, faint 12×8 hairline grid (or 45° stripes on ink panels), 3% noise.
function canvas({ id, w, h, bg, ink, frame, pattern = 'grid', extra = '' }) {
  const rows = [...Array(7)].map((_, i) => `M0 ${round((h * (i + 1)) / 8)}H${w}`).join('');
  const cols = [...Array(11)].map((_, i) => `M${round((w * (i + 1)) / 12)} 0V${h}`).join('');
  const texture =
    pattern === 'grid'
      ? `<path d="${rows}${cols}" stroke="${ink}" stroke-opacity="0.05"/>`
      : `<rect width="${w}" height="${h}" fill="url(#${id}-stripes)"/>`;
  return `
<defs>
  <clipPath id="${id}-frame"><rect width="${w}" height="${h}" rx="6"/></clipPath>
  <pattern id="${id}-stripes" width="41" height="41" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
    <rect x="40" width="1" height="41" fill="${ink}" fill-opacity="0.05"/>
  </pattern>
  <filter id="${id}-noise" x="0" y="0" width="100%" height="100%">
    <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" stitchTiles="stitch"/>
  </filter>
</defs>
<g clip-path="url(#${id}-frame)">
  <rect width="${w}" height="${h}" fill="${bg}"/>
  ${texture}
  <rect width="${w}" height="${h}" filter="url(#${id}-noise)" opacity="0.03"/>
  ${extra}
</g>
<rect x="0.5" y="0.5" width="${w - 1}" height="${h - 1}" rx="5.5" stroke="${frame}"/>`;
}

// The site's eyebrow: a 32px hairline, then a mono label.
const eyebrow = ({ x, y, label, line, color }) => `
<rect x="${x}" y="${y - 5}" width="32" height="1" fill="${line}"/>
<text x="${x + 44}" y="${y}" class="mono" font-size="14" fill="${color}">${label}</text>`;

const MARK_PATHS = {
  expected: 'M0 180L351 297.5L207.5 362L97 323.5V638.5L245 685V597.5L374.5 646.5V853L0 730.5V180Z',
  observed: 'M301 580L429.5 520.5L560 562.5V234.5L391 180V264L275.5 218.5V0L666 122.5V712L301 580Z',
  assertion: 'M245 390L391 332.5V489L245 542.5V390Z',
};

const mark = (t, x, y, height) => `
<g transform="translate(${x} ${y}) scale(${+(height / 853).toFixed(5)})">
  <path d="${MARK_PATHS.expected}" fill="${t.logo.ink}"/>
  <path d="${MARK_PATHS.observed}" fill="${t.logo.observed}"/>
  <path d="${MARK_PATHS.assertion}" fill="${t.logo.ink}"/>
</g>`;

const check = (x, y, color) =>
  `<path d="M${x} ${y + 5}l3.5 3.5L${x + 11} ${y}" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`;
const cross = (x, y, color) =>
  `<path d="M${x} ${y}l9 9M${x + 9} ${y}l-9 9" stroke="${color}" stroke-width="2" stroke-linecap="round"/>`;

const pill = ({ x, y, w, color, label, icon }) => `
<rect x="${x}" y="${y}" width="${w}" height="32" rx="16" fill="${color}" fill-opacity="0.1" stroke="${color}" stroke-opacity="0.4"/>
${icon === 'check' ? check(x + 15, y + 12, color) : cross(x + 16, y + 11.5, color)}
<text x="${x + 36}" y="${y + 21}" class="mono" font-size="13" font-weight="600" letter-spacing="0.8" fill="${color}">${label}</text>`;

// A frozen frame of the hero's AnimatedSphere (components/landing/AnimatedSphere.tsx).
function glyphSphere(cx, cy, radius, time = 2.4) {
  const chars = '░▒▓█▀▄▌▐│─┤├┴┬╭╮╰╯';
  const points = [];
  for (let phi = 0; phi < Math.PI * 2; phi += 0.15) {
    for (let theta = 0; theta < Math.PI; theta += 0.15) {
      const x = Math.sin(theta) * Math.cos(phi + time * 0.5);
      const y = Math.sin(theta) * Math.sin(phi + time * 0.5);
      const z = Math.cos(theta);
      const rotY = time * 0.3;
      const nx = x * Math.cos(rotY) - z * Math.sin(rotY);
      const nz = x * Math.sin(rotY) + z * Math.cos(rotY);
      const rotX = time * 0.2;
      const ny = y * Math.cos(rotX) - nz * Math.sin(rotX);
      const fz = y * Math.sin(rotX) + nz * Math.cos(rotX);
      points.push({ x: cx + nx * radius, y: cy + ny * radius, z: fz, char: chars[Math.floor(((fz + 1) / 2) * (chars.length - 1))] });
    }
  }
  return points
    .sort((a, b) => a.z - b.z)
    .map((p) => `<text x="${round(p.x)}" y="${round(p.y)}" fill-opacity="${(0.2 + (p.z + 1) * 0.4).toFixed(2)}">${p.char}</text>`)
    .join('');
}

// ── Artwork ──────────────────────────────────────────────────────────────────────────────────────

async function banner(t) {
  const W = 1280, H = 510;
  const sx = 1010, sy = 250;
  // "verified" leads so a static render (or reduced motion) shows the final word. Widths are the
  // advances measured in Chrome for the embedded Instrument Sans at 116px, so each underline bar
  // spans its word the way the hero's does.
  const words = [['verified', 375], ['expected', 477], ['executed', 470]];
  const css = `
  .spin { transform-origin: ${sx}px ${sy}px; animation: spin 160s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .word { animation: 9s cubic-bezier(0.22, 1, 0.36, 1) infinite; }
  .word-1, .word-2 { opacity: 0; }
  .word-0 { animation-name: word0; }
  .word-1 { animation-name: word1; }
  .word-2 { animation-name: word2; }
  @keyframes word0 {
    0%, 28% { opacity: 1; transform: none; filter: none; }
    33.33% { opacity: 0; transform: none; filter: blur(12px); }
    94% { opacity: 0; transform: translateY(28px); filter: blur(12px); }
    100% { opacity: 1; transform: none; filter: none; }
  }
  @keyframes word1 {
    0%, 33.33% { opacity: 0; transform: translateY(28px); filter: blur(12px); }
    38.33%, 61.66% { opacity: 1; transform: none; filter: none; }
    66.66%, 100% { opacity: 0; transform: none; filter: blur(12px); }
  }
  @keyframes word2 {
    0%, 66.66% { opacity: 0; transform: translateY(28px); filter: blur(12px); }
    71.66%, 94% { opacity: 1; transform: none; filter: none; }
    100% { opacity: 0; transform: none; filter: blur(12px); }
  }`;
  const sphere = `
  <g class="mono spin" font-size="11" text-anchor="middle" dominant-baseline="central" fill="${t.fg}" opacity="0.4">${glyphSphere(sx, sy, 270, 0.3)}</g>`;
  const badgeX = 1216 - 300;
  const body = `${canvas({ id: 'bn', w: W, h: H, bg: t.bg, ink: t.fg, frame: t.border, extra: sphere })}
${mark(t, 64, 38, 32)}
<text x="100" y="63" class="sans" font-size="25" font-weight="500" letter-spacing="-0.4" fill="${t.fg}">PolicyProbe</text>
<rect x="1058" y="36" width="158" height="40" rx="20" fill="${t.fg}"/>
<text x="1137" y="61" text-anchor="middle" class="sans" font-size="15" font-weight="500" fill="${t.bg}">Harness PR #74</text>
${eyebrow({ x: 64, y: 156, label: 'Hedera Testnet · Chain 296', line: mix(t.bg, t.fg, 0.3), color: t.muted })}
<text x="64" y="276" class="sans" font-size="116" letter-spacing="-3" fill="${t.fg}">Every policy</text>
${words
  .map(
    ([word, width], i) => `<g class="word word-${i}">
  <rect x="64" y="398" width="${width}" height="12" fill="${t.fg}" fill-opacity="0.1"/>
  <text x="64" y="380" class="sans" font-size="116" letter-spacing="-3" fill="${t.fg}">${word}</text>
</g>`,
  )
  .join('\n')}
<text class="sans" font-size="21" fill="${t.muted}"><tspan x="64" y="452">Exit code 0 is not proof. PolicyProbe checks</tspan><tspan x="64" y="480">what actually happened onchain.</tspan></text>
<rect x="${badgeX}" y="436" width="300" height="46" rx="23" fill="${t.bg}" stroke="${t.border}"/>
<circle cx="${badgeX + 26}" cy="459" r="4" fill="${t.pass}" class="pulse"/>
<text x="${badgeX + 42}" y="465" class="sans" font-size="16" font-weight="500" fill="${t.fg}">6 / 6 policies pass on testnet</text>`;
  return svg({ w: W, h: H, title: 'PolicyProbe — Expected. Executed. Verified.', css, body });
}

async function flow(t) {
  const W = 1280, H = 390;
  const { bg, text } = t.panel;
  const ink = (amount) => mix(bg, text, amount);
  const steps = [
    ['01', 'Declare', 'Recipe assertion'],
    ['02', 'Provision', 'Funded actors'],
    ['03', 'Execute', 'Action as signer'],
    ['04', 'Observe', 'Mirror Node read'],
    ['05', 'Compare', 'Expected vs observed'],
  ];
  const cw = 156, gap = 20, x0 = 56, cycle = 5 * steps.length;
  // Like the site's pipeline list, one step is active at a time and a progress hairline fills under it.
  const css = `
  .step { animation: step ${cycle}s infinite; }
  @keyframes step { 0%, 19% { opacity: 1; } 21%, 98% { opacity: 0.4; } 100% { opacity: 1; } }
  .progress { transform-box: fill-box; transform-origin: left; opacity: 0; animation: progress ${cycle}s linear infinite; }
  @keyframes progress { 0% { opacity: 1; transform: scaleX(0); } 20% { opacity: 1; transform: scaleX(1); } 20.1%, 100% { opacity: 0; transform: scaleX(1); } }`;
  const columns = steps.map(([n, title, caption], i) => {
    const x = x0 + i * (cw + gap);
    const delay = `animation-delay: ${-((cycle - 5 * i) % cycle)}s`;
    return `
<g class="step" style="${delay}">
  <text x="${x}" y="222" class="sans" font-size="30" fill="${ink(0.3)}">${n}</text>
  <text x="${x}" y="264" class="sans" font-size="26" letter-spacing="-0.4" fill="${text}">${title}</text>
  <text x="${x}" y="292" class="sans" font-size="14.5" fill="${ink(0.6)}">${caption}</text>
  <rect x="${x}" y="326" width="${cw}" height="1" fill="${ink(0.12)}"/>
</g>
<rect x="${x}" y="326" width="${cw}" height="1" fill="${text}" class="progress" style="${delay}"/>`;
  });
  const wx = 956, wy = 170, ww = 268, wh = 180;
  const rows = [
    [t.pass, 'match', 'continue the run'],
    [t.fail, 'mismatch', 'repair loop'],
    [t.warn, 'infra', 'chain-assertion-infra'],
  ];
  const window = `
<rect x="${wx}" y="${wy}" width="${ww}" height="${wh}" stroke="${ink(0.14)}"/>
${[0, 1, 2].map((i) => `<circle cx="${wx + 22 + i * 18}" cy="${wy + 20}" r="5" fill="${ink(0.2)}"/>`).join('')}
<text x="${wx + ww - 16}" y="${wy + 24}" text-anchor="end" class="mono" font-size="11.5" fill="${ink(0.4)}">verdict</text>
<rect x="${wx}" y="${wy + 40}" width="${ww}" height="1" fill="${ink(0.14)}"/>
${rows
  .map(
    ([color, outcome, route], i) => `
<circle cx="${wx + 24}" cy="${wy + 68 + i * 30}" r="4" fill="${color}"/>
<text x="${wx + 40}" y="${wy + 72 + i * 30}" class="mono" font-size="12" fill="${ink(0.7)}"><tspan fill="${text}">${outcome}</tspan> <tspan fill="${ink(0.4)}">→</tspan> ${route}</text>`,
  )
  .join('')}
<rect x="${wx}" y="${wy + 150}" width="${ww}" height="1" fill="${ink(0.14)}"/>
<circle cx="${wx + 24}" cy="${wy + 165}" r="3.5" fill="${t.pass}" class="pulse"/>
<text x="${wx + 38}" y="${wy + 169}" class="mono" font-size="11.5" fill="${ink(0.4)}">compared in code</text>`;
  const body = `${canvas({ id: 'fl', w: W, h: H, bg, ink: text, frame: ink(0.14), pattern: 'stripes' })}
${eyebrow({ x: 56, y: 72, label: 'How it works', line: ink(0.3), color: ink(0.5) })}
<text x="56" y="136" class="sans" font-size="44" letter-spacing="-1.2" fill="${text}">Five steps. <tspan fill="${ink(0.4)}">Pure code at every one.</tspan></text>
${columns.join('')}
${window}`;
  return svg({ w: W, h: H, title: 'How a PolicyProbe assertion reaches a verdict', css, body });
}

async function comparison(t) {
  const W = 1280, H = 590;
  const hairline = mix(t.card, t.fg, 0.3);
  const card = ({ x, tag, contract, title, observed, observedColor, tx, verdict }) => {
    const y = 176, w = 560, h = 380;
    const label = (yy, s) =>
      `<text x="${x + 32}" y="${yy}" class="mono" font-size="12" letter-spacing="1" fill="${t.muted}">${s}</text>`;
    const value = (yy, s, color) =>
      `<text x="${x + 168}" y="${yy}" class="mono" font-size="18" fill="${color}">${s}</text>`;
    return `
<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${t.card}" stroke="${t.border}"/>
<rect x="${x}" y="${y}" width="${w}" height="2" fill="${verdict.color}"/>
${eyebrow({ x: x + 32, y: y + 52, label: `Configuration ${tag}`, line: hairline, color: t.muted })}
<text x="${x + w - 32}" y="${y + 52}" text-anchor="end" class="mono" font-size="13" fill="${t.muted}">${contract}</text>
<text x="${x + 32}" y="${y + 110}" class="sans" font-size="36" letter-spacing="-0.9" fill="${t.fg}">${title}</text>
<rect x="${x + 32}" y="${y + 138}" width="${w - 64}" height="1" fill="${t.border}"/>
${label(y + 184, 'DECLARED')}${value(y + 184, 'mustRevert', t.fg)}
${label(y + 228, 'OBSERVED')}${value(y + 228, observed, observedColor)}
${label(y + 272, 'TX HASH')}${value(y + 272, tx, t.muted)}
<rect x="${x + 32}" y="${y + 302}" width="${w - 64}" height="1" fill="${t.border}"/>
${pill({ x: x + 32, y: y + 322, ...verdict })}
<text x="${x + 32 + verdict.w + 18}" y="${y + 343}" class="${verdict.font}" font-size="${verdict.size}" fill="${t.muted}">${verdict.caption}</text>`;
  };
  const connectors = 'M340 136V176M940 136V176';
  const body = `${canvas({ id: 'ba', w: W, h: H, bg: t.bg, ink: t.fg, frame: t.border })}
${eyebrow({ x: 60, y: 54, label: 'Same assertion · same actor · same action', line: mix(t.bg, t.fg, 0.3), color: t.muted })}
<text x="1220" y="54" text-anchor="end" class="mono" font-size="14" fill="${t.muted}">Hedera testnet</text>
<rect x="60" y="80" width="1160" height="56" fill="${t.card}" stroke="${t.border}"/>
<text x="88" y="114" class="mono" font-size="15" font-weight="600" fill="${t.fg}">reject-unverified-transfer</text>
<text x="560" y="114" class="mono" font-size="15" fill="${t.muted}">actor <tspan fill="${t.fg}">attacker</tspan></text>
<text x="800" y="114" class="mono" font-size="15" fill="${t.muted}">expect <tspan fill="${t.fg}">mustRevert</tspan></text>
<text x="1192" y="114" text-anchor="end" class="mono" font-size="13" fill="${t.muted}"><tspan fill="${t.fail}">●</tspan> 1 finding   <tspan fill="${t.pass}">●</tspan> 1 pass</text>
<path d="${connectors}" stroke="${t.border}"/>
<path d="${connectors}" stroke="${t.muted}" class="dash"/>
${card({
  x: 60, tag: 'A', contract: '0xeff72A…c9E03', title: 'Whitelist disabled',
  observed: 'SUCCESS', observedColor: t.fail, tx: '0xdcf971…8877c',
  verdict: {
    w: 118, color: t.fail, label: 'FINDING', icon: 'cross',
    caption: 'chain-assertion:reject-unverified-transfer', font: 'mono', size: 13,
  },
})}
${card({
  x: 660, tag: 'B', contract: '0x19CD78…606B8', title: 'Whitelist enabled',
  observed: 'CONTRACT_REVERT_EXECUTED', observedColor: t.fg, tx: '0x513432…91f6a',
  verdict: {
    w: 88, color: t.pass, label: 'PASS', icon: 'check',
    caption: 'Assertion satisfied — no finding emitted', font: 'sans', size: 15,
  },
})}`;
  return svg({ w: W, h: H, title: 'The same assertion against a misconfigured and a corrected bond', body });
}

async function stats(t) {
  const W = 1280, H = 180;
  const items = [
    ['6/6', 'ATS policies verified'],
    ['+82', 'Harness tests · 277 total'],
    ['2', 'assertion families'],
    ['~6', 'recipe lines per assertion'],
  ];
  const cells = items.map(([n, label], i) => {
    const x = 56 + i * 292;
    return `
<text x="${x}" y="100" class="sans" font-size="64" letter-spacing="-1.6" fill="${t.fg}">${n}</text>
<text x="${x}" y="136" class="mono" font-size="13.5" fill="${t.muted}">${label}</text>`;
  });
  const body = `${canvas({ id: 'st', w: W, h: H, bg: t.bg, ink: t.fg, frame: t.border })}${cells.join('')}`;
  return svg({ w: W, h: H, title: 'PolicyProbe by the numbers', body });
}

const markArt = (t) => svg({ w: 666, h: 853, title: 'PolicyProbe', body: mark(t, 0, 0, 853), fonts: false });

const ART = { banner, flow, comparison, stats, mark: markArt };

for (const [name, render] of Object.entries(ART)) {
  for (const [theme, t] of Object.entries(THEMES)) {
    const output = await render(t);
    writeFileSync(join(OUT, `${name}-${theme}.svg`), output);
    console.log(`${name}-${theme}.svg  ${(output.length / 1024).toFixed(1)} KB`);
  }
}
