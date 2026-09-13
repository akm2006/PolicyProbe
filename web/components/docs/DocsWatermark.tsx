/**
 * Decorative block field behind the top of every docs page. Rendered on the server from a
 * deterministic pattern and tinted with the foreground color, so it follows light/dark mode.
 */
const COLS = 18;
const ROWS = 6;
const CELL = 64;
const GAP = 8;
const STEP = CELL + GAP;

// Deterministic pseudo-random value in [0, 1) — the pattern must be identical on every render.
function hash(col: number, row: number): number {
  const s = Math.sin(col * 127.1 + row * 311.7) * 43758.5453;
  return s - Math.floor(s);
}

const blocks = Array.from({ length: COLS * ROWS }, (_, i) => {
  const col = i % COLS;
  const row = Math.floor(i / COLS);
  // Denser toward the top-right, where the field sits behind the page heading.
  const weight = (col / (COLS - 1)) * (1 - row / ROWS);
  return { col, row, n: hash(col, row), weight };
}).filter((block) => block.n > 0.35 && block.weight > 0.05);

export function DocsWatermark() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute top-0 left-0 -right-72 -z-10 h-[400px] overflow-hidden text-fd-foreground [mask-image:radial-gradient(ellipse_70%_90%_at_70%_0%,#000_20%,transparent_75%)]"
    >
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox={`0 0 ${COLS * STEP} ${ROWS * STEP}`}
        preserveAspectRatio="xMaxYMin slice"
      >
        {blocks.map(({ col, row, n, weight }) => {
          const x = col * STEP;
          const y = row * STEP;
          return (
            <g key={`${col}-${row}`}>
              <rect
                x={x}
                y={y}
                width={CELL}
                height={CELL}
                rx={4}
                fill="currentColor"
                fillOpacity={0.015 + 0.09 * n * weight}
              />
              {n > 0.94 && (
                // Offset outline: the expected/observed offset from the PolicyProbe mark.
                <rect
                  x={x + 10}
                  y={y - 10}
                  width={CELL}
                  height={CELL}
                  rx={4}
                  fill="none"
                  stroke="currentColor"
                  strokeOpacity={0.25 * weight}
                />
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
