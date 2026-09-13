#!/usr/bin/env node
// Renders the README artwork (banner, flow, comparison, stats, mark) in light and dark variants.
// The SVGs are served through <picture> so GitHub picks the one matching the viewer's theme.
// Usage: node .github/assets/build-readme-art.mjs
import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const OUT = dirname(fileURLToPath(import.meta.url));
const BRAND = '#734AF9';

const THEMES = {
  dark: {
    bg: '#0c0a09', surface: '#151311', raised: '#1c1917',
    border: '#292524', borderStrong: '#3b3632',
    text: '#faf9f6', muted: '#a8a29e', faint: '#77706a',
    accent: '#9277ff', dot: '#ffffff', dotOpacity: 0.07, glow: 0.32,
    pass: '#4cc38a', fail: '#f26d57', warn: '#e3a73f',
  },
  light: {
    bg: '#faf9f6', surface: '#ffffff', raised: '#f5f4f1',
    border: '#e7e5e4', borderStrong: '#d6d3d1',
    text: '#1c1917', muted: '#6b645c', faint: '#948d86',
    accent: BRAND, dot: '#1c1917', dotOpacity: 0.08, glow: 0.14,
    pass: '#1f8a55', fail: '#d92d20', warn: '#b7791f',
  },
};

const BASE_CSS = `
  .sans { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Helvetica, Arial, sans-serif; }
  .mono { font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace; }
  .serif { font-family: 'Iowan Old Style', 'Palatino Linotype', Palatino, 'Book Antiqua', Georgia, serif; }
  .flow { stroke-dasharray: 3 7; animation: flow 1.4s linear infinite; }
  @keyframes flow { to { stroke-dashoffset: -20; } }
  @media (prefers-reduced-motion: reduce) { * { animation: none !important; } }`;

const MARK_PATHS = {
  expected: 'M0 180L351 297.5L207.5 362L97 323.5V638.5L245 685V597.5L374.5 646.5V853L0 730.5V180Z',
  observed: 'M301 580L429.5 520.5L560 562.5V234.5L391 180V264L275.5 218.5V0L666 122.5V712L301 580Z',
  assertion: 'M245 390L391 332.5V489L245 542.5V390Z',
};

const mark = (t, x, y, height) => `
<g transform="translate(${x} ${y}) scale(${+(height / 853).toFixed(5)})">
  <path d="${MARK_PATHS.expected}" fill="${t.text}"/>
  <path d="${MARK_PATHS.observed}" fill="${BRAND}"/>
  <path d="${MARK_PATHS.assertion}" fill="${BRAND}"/>
</g>`;

const svg = ({ w, h, title, css = '', body }) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" fill="none" role="img" aria-label="${title}">
<title>${title}</title>
<style>${BASE_CSS}${css}</style>
${body}
</svg>
`;

// Rounded canvas with a faded dot grid, shared by every wide graphic.
const canvas = (t, w, h, id, extra = '') => `
<defs>
  <clipPath id="${id}-frame"><rect width="${w}" height="${h}" rx="20"/></clipPath>
  <pattern id="${id}-dots" width="22" height="22" patternUnits="userSpaceOnUse">
    <circle cx="1.5" cy="1.5" r="1.1" fill="${t.dot}" fill-opacity="${t.dotOpacity}"/>
  </pattern>
  <radialGradient id="${id}-fade" cx="50%" cy="50%" r="65%">
    <stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#fff" stop-opacity="0"/>
  </radialGradient>
  <mask id="${id}-mask"><rect width="${w}" height="${h}" fill="url(#${id}-fade)"/></mask>
  <radialGradient id="${id}-glow">
    <stop offset="0" stop-color="${BRAND}" stop-opacity="${t.glow}"/><stop offset="1" stop-color="${BRAND}" stop-opacity="0"/>
  </radialGradient>
</defs>
<g clip-path="url(#${id}-frame)">
  <rect width="${w}" height="${h}" fill="${t.bg}"/>
  <rect width="${w}" height="${h}" fill="url(#${id}-dots)" mask="url(#${id}-mask)"/>
  ${extra}
</g>
<rect x="0.5" y="0.5" width="${w - 1}" height="${h - 1}" rx="19.5" stroke="${t.border}"/>`;

const check = (x, y, color) =>
  `<path d="M${x} ${y + 5}l3.5 3.5L${x + 11} ${y}" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`;
const cross = (x, y, color) =>
  `<path d="M${x} ${y}l9 9M${x + 9} ${y}l-9 9" stroke="${color}" stroke-width="2" stroke-linecap="round"/>`;

const pill = ({ x, y, w, color, label, icon }) => `
<rect x="${x}" y="${y}" width="${w}" height="30" rx="15" fill="${color}" fill-opacity="0.12" stroke="${color}" stroke-opacity="0.45"/>
${icon === 'check' ? check(x + 14, y + 11, color) : cross(x + 15, y + 10.5, color)}
<text x="${x + 34}" y="${y + 20}" class="mono" font-size="13" font-weight="700" letter-spacing="1" fill="${color}">${label}</text>`;

function banner(t) {
  const W = 1280, H = 440;
  const cx = 772, cy = 100, cw = 420, ch = 262;
  const layer = (d, opacity) =>
    `<rect x="${cx + d}" y="${cy - d}" width="${cw}" height="${ch}" rx="14" fill="${t.surface}" stroke="${t.borderStrong}" opacity="${opacity}"/>`;
  const row = (y, label, value) => `
  <text x="${cx + 28}" y="${y}" class="mono" font-size="13" fill="${t.faint}">${label}</text>
  <text x="${cx + 128}" y="${y}" class="mono" font-size="14" fill="${t.text}">${value}</text>`;
  const extra = `
  <ellipse cx="190" cy="230" rx="360" ry="300" fill="url(#bn-glow)" class="breathe"/>
  <ellipse cx="1000" cy="230" rx="420" ry="260" fill="url(#bn-glow)" opacity="0.5"/>
  <polygon points="1010,-60 1340,50 1340,520 1010,410" stroke="${t.border}" stroke-width="1.5"/>`;
  const css = `
  .breathe { animation: breathe 7s ease-in-out infinite; }
  @keyframes breathe { 0%, 100% { opacity: 1; } 50% { opacity: 0.55; } }
  .scan { animation: scan 5s ease-in-out infinite; opacity: 0; }
  @keyframes scan { 0% { transform: translateY(0); opacity: 0; } 20%, 80% { opacity: 1; } 100% { transform: translateY(150px); opacity: 0; } }
  .pulse { transform-box: fill-box; transform-origin: center; animation: pulse 2.4s ease-out infinite; }
  @keyframes pulse { 0% { transform: scale(1); opacity: 0.6; } 100% { transform: scale(3.4); opacity: 0; } }`;
  const body = `${canvas(t, W, H, 'bn', extra)}
<defs>
  <clipPath id="bn-card"><rect x="${cx}" y="${cy}" width="${cw}" height="${ch}" rx="14"/></clipPath>
  <linearGradient id="bn-scan" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="${BRAND}" stop-opacity="0"/>
    <stop offset="0.5" stop-color="${BRAND}" stop-opacity="0.12"/>
    <stop offset="1" stop-color="${BRAND}" stop-opacity="0"/>
  </linearGradient>
</defs>
${mark(t, 88, 135, 170)}
<text x="262" y="214" class="sans" font-size="74" font-weight="650" letter-spacing="-2.4" fill="${t.text}">PolicyProbe</text>
<text x="265" y="264" class="serif" font-size="31" font-style="italic" fill="${t.muted}">Expected. Executed. <tspan fill="${t.accent}">Verified.</tspan></text>
<rect x="266" y="296" width="36" height="2" rx="1" fill="${BRAND}"/>
<text x="266" y="334" class="mono" font-size="13.5" letter-spacing="2.4" fill="${t.muted}">DETERMINISTIC ON-CHAIN ASSERTIONS</text>
<text x="266" y="358" class="mono" font-size="13.5" letter-spacing="2.4" fill="${t.faint}">FOR HEDERA HARNESS</text>

${layer(28, 0.35)}
${layer(14, 0.7)}
<rect x="${cx}" y="${cy}" width="${cw}" height="${ch}" rx="14" fill="${t.surface}" stroke="${t.borderStrong}"/>
<g clip-path="url(#bn-card)"><rect class="scan" x="${cx}" y="${cy + 44}" width="${cw}" height="64" fill="url(#bn-scan)"/></g>
<text x="${cx + 28}" y="${cy + 28}" class="mono" font-size="12" letter-spacing="1.2" fill="${t.faint}">chainValidation.assertions</text>
<rect x="${cx + cw - 100}" y="${cy + 12}" width="74" height="22" rx="11" fill="${t.raised}" stroke="${t.border}"/>
<circle cx="${cx + cw - 86}" cy="${cy + 23}" r="3" fill="${t.pass}"/>
<text x="${cx + cw - 77}" y="${cy + 27}" class="mono" font-size="11" fill="${t.muted}">testnet</text>
<line x1="${cx}" y1="${cy + 44}" x2="${cx + cw}" y2="${cy + 44}" stroke="${t.border}"/>
<circle cx="${cx + 32}" cy="${cy + 76}" r="4" fill="${t.accent}" class="pulse"/>
<circle cx="${cx + 32}" cy="${cy + 76}" r="4" fill="${t.accent}"/>
<text x="${cx + 46}" y="${cy + 81}" class="mono" font-size="16" font-weight="600" fill="${t.text}">reject-unverified-transfer</text>
${row(cy + 118, 'actor', 'attacker')}
${row(cy + 146, 'expect', 'mustRevert')}
${row(cy + 174, 'observed', 'CONTRACT_REVERT_EXECUTED')}
<line x1="${cx}" y1="${cy + 198}" x2="${cx + cw}" y2="${cy + 198}" stroke="${t.border}"/>
${pill({ x: cx + 28, y: cy + 214, w: 84, color: t.pass, label: 'PASS', icon: 'check' })}
<text x="${cx + 128}" y="${cy + 234}" class="sans" font-size="13.5" fill="${t.muted}">Verdict from Mirror Node evidence</text>`;
  return svg({ w: W, h: H, title: 'PolicyProbe — Expected. Executed. Verified.', css, body });
}

function flow(t) {
  const W = 1280, H = 300;
  const steps = [
    ['01', 'Declare', 'Recipe assertion'],
    ['02', 'Provision', 'Funded actors'],
    ['03', 'Execute', 'Action as signer'],
    ['04', 'Observe', 'Mirror Node read'],
    ['05', 'Compare', 'Expected vs observed'],
  ];
  const nw = 164, nh = 108, gap = 30, x0 = 36, ny = 112, mid = ny + nh / 2;
  const nodes = steps.map(([n, title, caption], i) => {
    const x = x0 + i * (nw + gap);
    const core = i === steps.length - 1;
    const link = i === 0 ? '' : `
<line x1="${x - gap}" y1="${mid}" x2="${x - 4}" y2="${mid}" stroke="${t.borderStrong}" stroke-width="1.5"/>
<line x1="${x - gap}" y1="${mid}" x2="${x - 4}" y2="${mid}" stroke="${t.accent}" stroke-width="1.5" class="flow"/>
<path d="M${x - 9} ${mid - 4}l5 4-5 4" stroke="${t.muted}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>`;
    return `${link}
<rect x="${x}" y="${ny}" width="${nw}" height="${nh}" rx="12" fill="${t.surface}" stroke="${core ? t.accent : t.border}" stroke-opacity="${core ? 0.75 : 1}"/>
<text x="${x + 20}" y="${ny + 32}" class="mono" font-size="12" font-weight="600" fill="${t.accent}">${n}</text>
<text x="${x + 20}" y="${ny + 64}" class="sans" font-size="19" font-weight="600" fill="${t.text}">${title}</text>
<text x="${x + 20}" y="${ny + 88}" class="sans" font-size="13" fill="${t.muted}">${caption}</text>`;
  });
  const outcomes = [
    [t.pass, 'Match', 'continue the run'],
    [t.fail, 'Mismatch', 'finding → repair loop'],
    [t.warn, 'Infra error', 'chain-assertion-infra'],
  ];
  const ox = 1024, ow = 220, oh = 56, from = x0 + steps.length * (nw + gap) - gap;
  const chips = outcomes.map(([color, title, caption], i) => {
    const cy = mid + (i - 1) * 74;
    return `
<path d="M${from} ${mid}C${from + 26} ${mid} ${ox - 26} ${cy} ${ox} ${cy}" stroke="${t.borderStrong}" stroke-width="1.5"/>
<path d="M${from} ${mid}C${from + 26} ${mid} ${ox - 26} ${cy} ${ox} ${cy}" stroke="${color}" stroke-width="1.5" class="flow"/>
<rect x="${ox}" y="${cy - oh / 2}" width="${ow}" height="${oh}" rx="10" fill="${t.surface}" stroke="${color}" stroke-opacity="0.45"/>
<circle cx="${ox + 22}" cy="${cy}" r="9" fill="${color}" fill-opacity="0.15"/>
<circle cx="${ox + 22}" cy="${cy}" r="4" fill="${color}"/>
<text x="${ox + 42}" y="${cy - 4}" class="sans" font-size="15" font-weight="600" fill="${t.text}">${title}</text>
<text x="${ox + 42}" y="${cy + 15}" class="mono" font-size="11.5" fill="${t.muted}">${caption}</text>`;
  });
  const body = `${canvas(t, W, H, 'fl')}
<text x="${x0}" y="62" class="mono" font-size="11.5" letter-spacing="2.4" fill="${t.faint}">ONE ASSERTION · DECLARATION TO VERDICT</text>
${nodes.join('')}
${chips.join('')}`;
  return svg({ w: W, h: H, title: 'How a PolicyProbe assertion reaches a verdict', body });
}

function comparison(t) {
  const W = 1280, H = 560;
  const card = ({ x, tag, contract, title, observed, observedColor, tx, verdict }) => {
    const y = 178, w = 560, h = 350;
    const label = (yy, s) =>
      `<text x="${x + 32}" y="${yy}" class="mono" font-size="11.5" letter-spacing="1.6" fill="${t.faint}">${s}</text>`;
    const value = (yy, s, color) =>
      `<text x="${x + 168}" y="${yy}" class="mono" font-size="17" fill="${color}">${s}</text>`;
    return `
<clipPath id="ba-${tag}"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="16"/></clipPath>
<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="16" fill="${t.surface}" stroke="${t.border}"/>
<rect x="${x}" y="${y}" width="${w}" height="3" fill="${verdict.color}" clip-path="url(#ba-${tag})"/>
<text x="${x + 32}" y="${y + 44}" class="mono" font-size="11.5" letter-spacing="2" fill="${t.faint}">CONFIGURATION ${tag.toUpperCase()}</text>
<text x="${x + w - 32}" y="${y + 44}" text-anchor="end" class="mono" font-size="12" fill="${t.muted}">${contract}</text>
<text x="${x + 32}" y="${y + 86}" class="sans" font-size="28" font-weight="600" letter-spacing="-0.5" fill="${t.text}">${title}</text>
<line x1="${x + 32}" y1="${y + 110}" x2="${x + w - 32}" y2="${y + 110}" stroke="${t.border}"/>
${label(y + 150, 'DECLARED')}${value(y + 150, 'mustRevert', t.text)}
${label(y + 194, 'OBSERVED')}${value(y + 194, observed, observedColor)}
${label(y + 238, 'TX HASH')}${value(y + 238, tx, t.muted)}
<line x1="${x + 32}" y1="${y + 268}" x2="${x + w - 32}" y2="${y + 268}" stroke="${t.border}"/>
${pill({ x: x + 32, y: y + 292, ...verdict })}
<text x="${x + 32 + verdict.w + 20}" y="${y + 312}" class="${verdict.captionClass}" font-size="${verdict.captionSize}" fill="${t.muted}">${verdict.caption}</text>`;
  };
  const connector = 'M640 114V140M640 140H352Q340 140 340 152V178M640 140H928Q940 140 940 152V178';
  const body = `${canvas(t, W, H, 'ba')}
<text x="640" y="44" text-anchor="middle" class="mono" font-size="11.5" letter-spacing="2.4" fill="${t.faint}">SAME ASSERTION · SAME ACTOR · SAME ACTION</text>
<path d="${connector}" stroke="${t.borderStrong}" stroke-width="1.5"/>
<path d="${connector}" stroke="${t.accent}" stroke-width="1.5" class="flow"/>
<rect x="320" y="62" width="640" height="52" rx="26" fill="${t.surface}" stroke="${t.borderStrong}"/>
<text x="640" y="93" text-anchor="middle" class="mono" font-size="14" fill="${t.muted}" xml:space="preserve"><tspan fill="${t.text}" font-weight="600">reject-unverified-transfer</tspan><tspan fill="${t.faint}">  ·  </tspan>actor <tspan fill="${t.text}">attacker</tspan><tspan fill="${t.faint}">  ·  </tspan>expect <tspan fill="${t.accent}">mustRevert</tspan></text>
${card({
  x: 60, tag: 'a', contract: '0xeff72A…c9E03', title: 'Whitelist disabled',
  observed: 'SUCCESS', observedColor: t.fail, tx: '0xdcf971…8877c',
  verdict: {
    w: 116, color: t.fail, label: 'FINDING', icon: 'cross',
    caption: 'chain-assertion:reject-unverified-transfer', captionClass: 'mono', captionSize: 12.5,
  },
})}
${card({
  x: 660, tag: 'b', contract: '0x19CD78…606B8', title: 'Whitelist enabled',
  observed: 'CONTRACT_REVERT_EXECUTED', observedColor: t.text, tx: '0x513432…91f6a',
  verdict: {
    w: 84, color: t.pass, label: 'PASS', icon: 'check',
    caption: 'Assertion satisfied — no finding emitted', captionClass: 'sans', captionSize: 14,
  },
})}`;
  return svg({ w: W, h: H, title: 'The same assertion against a misconfigured and a corrected bond', body });
}

function stats(t) {
  const W = 1280, H = 180;
  const items = [
    ['6', '/6', 'policies passed on testnet', 'ATS bond · Mirror Node evidence'],
    ['+82', '', 'Harness tests added', '195 → 277 in the full suite'],
    ['2', '', 'assertion families', 'outcome · balance delta'],
    ['~6', '', 'recipe lines per assertion', 'the engine owns the rest'],
  ];
  const cells = items.map(([n, suffix, label, sub], i) => {
    const cx = 160 + i * 320;
    const divider = i === 0 ? '' : `<line x1="${cx - 160}" y1="44" x2="${cx - 160}" y2="136" stroke="${t.border}"/>`;
    return `${divider}
<text x="${cx}" y="84" text-anchor="middle" class="sans" font-size="50" font-weight="650" letter-spacing="-1.5" fill="${t.text}">${n}<tspan fill="${t.faint}">${suffix}</tspan></text>
<text x="${cx}" y="116" text-anchor="middle" class="sans" font-size="15" font-weight="500" fill="${t.text}">${label}</text>
<text x="${cx}" y="140" text-anchor="middle" class="mono" font-size="12" fill="${t.faint}">${sub}</text>`;
  });
  return svg({ w: W, h: H, title: 'PolicyProbe by the numbers', body: `${canvas(t, W, H, 'st')}${cells.join('')}` });
}

const markFile = (t) => svg({ w: 666, h: 853, title: 'PolicyProbe', body: mark(t, 0, 0, 853) });

const ART = { banner, flow, comparison, stats, mark: markFile };

for (const [name, render] of Object.entries(ART)) {
  for (const [theme, t] of Object.entries(THEMES)) {
    writeFileSync(join(OUT, `${name}-${theme}.svg`), render(t));
  }
}
console.log(`wrote ${Object.keys(ART).length * Object.keys(THEMES).length} SVGs to ${OUT}`);
