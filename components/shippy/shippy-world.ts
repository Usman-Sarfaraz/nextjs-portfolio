import type MatterType from "matter-js";
import type { Body, Engine } from "matter-js";

type Matter = typeof MatterType;

/**
 * A piece of a fort, authored at scale 1: `dx` from the tower's centre, `y` from the tabletop to the piece's bottom.
 * Pillars stand upright, planks lie across them (and carry a label), bugs are the targets.
 */
export type PieceKind = "block" | "pillar" | "plank" | "bug";
type PieceSpec = { kind: Exclude<PieceKind, "block">; dx: number; y: number; w?: number; label?: string };

/** A tower stands on its own table at `at` (a fraction of the content width): either stacked `rows` of labelled blocks, or fort `pieces`. */
type Tower = { at: number; width?: number; rows?: string[][]; pieces?: PieceSpec[] };
/** `par` is the shot count for three stars. */
export type Level = { name: string; par: number; towers: Tower[] };

const PILLAR = { w: 20, h: 70 };
const PLANK_H = 18;
const BUG_R = 14;

const pillar = (dx: number, y: number): PieceSpec => ({ kind: "pillar", dx, y });
const plank = (dx: number, y: number, w: number, label: string): PieceSpec => ({ kind: "plank", dx, y, w, label });
const target = (dx: number, y: number): PieceSpec => ({ kind: "bug", dx, y });

// Level 0 is the footer's tower of labelled blocks; levels 1 to 4 are the playground's forts, with bugs to clear.
export const LEVELS: Level[] = [
  { name: "The stack", par: 3, towers: [{ at: 0.76, rows: [["Tailwind CSS"], ["TypeScript"], ["Next.js"], ["Vue.js"], ["React"], ["Nuxt"]] }] },
  {
    name: "First fort",
    par: 2,
    towers: [{ at: 0.72, width: 260, pieces: [pillar(-50, 0), pillar(50, 0), target(0, 0), plank(0, 70, 140, "React"), target(0, 88)] }],
  },
  {
    name: "Two floors",
    par: 3,
    towers: [
      {
        at: 0.72,
        width: 260,
        pieces: [
          pillar(-55, 0), pillar(55, 0), target(0, 0), plank(0, 70, 150, "Next.js"),
          pillar(-40, 88), pillar(40, 88), target(0, 88), plank(0, 158, 120, "TypeScript"), target(0, 176),
        ],
      },
    ],
  },
  {
    name: "Twin forts",
    par: 3,
    towers: [
      { at: 0.56, width: 170, pieces: [pillar(-38, 0), pillar(38, 0), target(0, 0), plank(0, 70, 110, "Vue.js"), target(0, 88)] },
      { at: 0.84, width: 170, pieces: [pillar(-38, 0), pillar(38, 0), target(0, 0), plank(0, 70, 110, "Nuxt"), target(0, 88)] },
    ],
  },
  {
    name: "Castle",
    par: 4,
    towers: [
      {
        at: 0.7,
        width: 340,
        pieces: [
          pillar(-120, 0), pillar(-50, 0), pillar(50, 0), pillar(120, 0), target(-85, 0), target(85, 0),
          plank(-85, 70, 110, "HTML"), plank(85, 70, 110, "CSS"), plank(0, 88, 250, "Tailwind CSS"),
          pillar(-45, 106), pillar(45, 106), target(0, 106), plank(0, 176, 140, "React"), target(0, 194),
        ],
      },
    ],
  },
];

/** The things a level is won by clearing: its bugs, or every block when it has none. */
export function targetCount(level: number): number {
  const spec = LEVELS[level] ?? LEVELS[0]!;
  const bugs = spec.towers.reduce((sum, tower) => sum + (tower.pieces ?? []).filter((piece) => piece.kind === "bug").length, 0);
  return bugs || spec.towers.reduce((sum, tower) => sum + (tower.rows ?? []).flat().length, 0);
}

export type Block = { label: string; kind: PieceKind; body: Body; width: number; height: number };

export type World = {
  engine: Engine;
  shippy: Body;
  shippySize: number;
  /** Every piece, for drawing. */
  blocks: Block[];
  /** What must be cleared to win: the bugs, or all blocks on a level without bugs. */
  targets: Block[];
  anchor: { x: number; y: number };
  maxPull: number;
  /** Pieces below this line have fallen off their table. */
  tableTop: number;
  tables: Rect[];
  scale: number;
};

export type Rect = { x: number; y: number; width: number; height: number };

/** Matter's default gravity: px per step² at 60 steps per second. */
export const GRAVITY_PER_STEP = 0.001 * (1000 / 60) ** 2;
export const LAUNCH_POWER = 0.23;

const AIR = 0.004;

/**
 * The launch velocity that carries Shippy from `from` to `goal`, allowing for air friction.
 * Horizontal speed grows a little with distance; the vertical speed is found by simulating the arc.
 */
export function aimVelocity(from: { x: number; y: number }, goal: { x: number; y: number }, scale: number): { x: number; y: number } {
  const dx = goal.x - from.x;
  const vx = 17 * scale * Math.min(1.35, Math.max(0.9, Math.sqrt(Math.abs(dx) / (600 * scale)))) * (0.97 + Math.random() * 0.06);
  // The height Shippy reaches at goal.x for a given vertical launch speed.
  const heightAt = (vy: number) => {
    let x = from.x;
    let y = from.y;
    let sx = vx;
    let sy = vy;
    for (let step = 0; step < 400 && x < goal.x; step++) {
      sy += GRAVITY_PER_STEP;
      sx *= 1 - AIR;
      sy *= 1 - AIR;
      x += sx;
      y += sy;
    }
    return y;
  };
  let low = -40;
  let high = 20;
  for (let i = 0; i < 24; i++) {
    const mid = (low + high) / 2;
    if (heightAt(mid) > goal.y) high = mid;
    else low = mid;
  }
  return { x: vx, y: (low + high) / 2 };
}

/** Mirrors the footer's side padding (.footerSignature in contact.module.css), so the scene lines up with the wordmark. */
function pageGutter(width: number): number {
  if (width < 768) return 24;
  if (width < 1024) return 32;
  return Math.max(64, (width - 1440) / 2 + 64);
}

export function buildWorld(M: Matter, width: number, height: number, options: { level?: number | undefined; gutter?: number | undefined; tableHeight?: number } = {}): World {
  const { Engine, Bodies, Composite } = M;
  const level = LEVELS[options.level ?? 0] ?? LEVELS[0]!;
  // The footer stage is full bleed with the scene inside the content area; cards pass their own gutter.
  const gutter = options.gutter ?? pageGutter(width);
  const inner = width - gutter * 2;
  const scale = Math.min(1, Math.max(0.58, inner / 1000));
  const engine = Engine.create();
  engine.positionIterations = 10;

  const floorY = height - 12;
  const wall = 400;
  Composite.add(engine.world, [
    Bodies.rectangle(width / 2, floorY + wall / 2, width * 4, wall, { isStatic: true, friction: 0.8 }),
    Bodies.rectangle(-wall / 2, height / 2, wall, height * 4, { isStatic: true }),
  ]);

  const blockHeight = 34 * scale;
  const gap = 2 * scale;
  const widthOf = (label: string) => (label.length * 7.4 + 34) * scale;
  const tableHeight = (options.tableHeight ?? 96) * scale;
  const tableTop = floorY - tableHeight;
  const tables: Rect[] = [];
  const blocks: Block[] = [];
  const wood = { chamfer: { radius: 4 * scale }, density: 0.0012, friction: 0.8, restitution: 0.05 };
  // Forts read small on wide stages, so they grow there; phones keep the base size so every fort fits.
  const fort = inner > 640 ? 1.3 : 1;

  level.towers.forEach((tower) => {
    const x = gutter + inner * tower.at;
    const rows = tower.rows ?? [];
    const rowWidths = rows.map((row) => row.reduce((sum, label) => sum + widthOf(label), 0) + gap * (row.length - 1));
    // Levels with two towers use slimmer tables so both fit on a phone.
    const minTable = (level.towers.length > 1 ? 150 : 230) * scale;
    const tableWidth = tower.width ? tower.width * scale * fort : Math.max(minTable, Math.max(0, ...rowWidths) + 40 * scale);
    const table = { x, y: floorY - tableHeight / 2, width: tableWidth, height: tableHeight };
    tables.push(table);
    Composite.add(engine.world, Bodies.rectangle(table.x, table.y, table.width, table.height, { isStatic: true, friction: 0.9 }));

    // Stack the rows bottom to top; a lone block sits a touch off centre so the tower wobbles.
    let top = tableTop;
    rows.forEach((row, rowIndex) => {
      let left = x - (rowWidths[rowIndex] ?? 0) / 2 + (row.length === 1 ? (rowIndex % 2 ? 3 : -3) * scale : 0);
      row.forEach((label) => {
        const blockWidth = widthOf(label);
        const body = Bodies.rectangle(left + blockWidth / 2, top - blockHeight / 2, blockWidth, blockHeight, {
          chamfer: { radius: 6 * scale },
          density: 0.0012,
          friction: 0.6,
          restitution: 0.1,
        });
        blocks.push({ label, kind: "block", body, width: blockWidth, height: blockHeight });
        left += blockWidth + gap;
      });
      top -= blockHeight;
    });

    // Fort pieces, placed from the tabletop up.
    (tower.pieces ?? []).forEach((piece) => {
      const unit = scale * fort;
      const px = x + piece.dx * unit;
      const bottom = tableTop - piece.y * unit;
      if (piece.kind === "bug") {
        const r = BUG_R * unit;
        const body = Bodies.circle(px, bottom - r, r, { density: 0.0009, friction: 0.5, restitution: 0.2 });
        blocks.push({ label: "", kind: "bug", body, width: r * 2, height: r * 2 });
      } else if (piece.kind === "pillar") {
        const w = PILLAR.w * unit;
        const h = PILLAR.h * unit;
        blocks.push({ label: "", kind: "pillar", body: Bodies.rectangle(px, bottom - h / 2, w, h, wood), width: w, height: h });
      } else {
        const w = (piece.w ?? 120) * unit;
        const h = PLANK_H * unit;
        blocks.push({ label: piece.label ?? "", kind: "plank", body: Bodies.rectangle(px, bottom - h / 2, w, h, wood), width: w, height: h });
      }
    });
  });
  Composite.add(engine.world, blocks.map((block) => block.body));
  const bugs = blocks.filter((block) => block.kind === "bug");
  const targets = bugs.length ? bugs : blocks;

  const shippySize = 42 * scale;
  const anchor = { x: gutter + Math.max(70, inner * 0.15), y: floorY - 150 * scale };
  const shippy = Bodies.rectangle(anchor.x, anchor.y, shippySize, shippySize, {
    chamfer: { radius: 9 * scale },
    density: 0.006,
    restitution: 0.3,
    friction: 0.5,
    frictionAir: AIR,
  });
  // Pin it after creation: a body created static never stores its real mass, so it could not be released later.
  M.Body.setStatic(shippy, true);
  Composite.add(engine.world, shippy);

  return { engine, shippy, shippySize, blocks, targets, anchor, maxPull: 105 * scale, tableTop, tables, scale };
}

/** Stars for clearing a level in `shots`: three at par or better, two within two more, otherwise one. */
export function starsFor(level: number, shots: number): number {
  const par = LEVELS[level]?.par ?? 3;
  return shots <= par ? 3 : shots <= par + 2 ? 2 : 1;
}
