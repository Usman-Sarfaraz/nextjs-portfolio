import type MatterType from "matter-js";
import type { Body, Engine } from "matter-js";

type Matter = typeof MatterType;

export const BACKLOG = ["Tailwind CSS", "TypeScript", "Next.js", "Vue.js", "React", "Nuxt"] as const;

export type Block = { label: string; body: Body; width: number; height: number };

export type World = {
  engine: Engine;
  shippy: Body;
  shippySize: number;
  blocks: Block[];
  anchor: { x: number; y: number };
  maxPull: number;
  /** Blocks below this line have fallen off the table. */
  tableTop: number;
  table: { x: number; y: number; width: number; height: number };
  scale: number;
};

/** Matter's default gravity: px per step² at 60 steps per second. */
export const GRAVITY_PER_STEP = 0.001 * (1000 / 60) ** 2;
export const LAUNCH_POWER = 0.23;

/** Mirrors the footer's side padding (.footerSignature in contact.module.css), so the scene lines up with the wordmark. */
function pageGutter(width: number): number {
  if (width < 768) return 24;
  if (width < 1024) return 32;
  return Math.max(64, (width - 1440) / 2 + 64);
}

export function buildWorld(M: Matter, width: number, height: number): World {
  const { Engine, Bodies, Composite } = M;
  // The stage is full bleed, but the slingshot and table sit inside the content area.
  const gutter = pageGutter(width);
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

  const table = { x: gutter + inner * 0.76, width: 230 * scale, height: 96 * scale, y: 0 };
  table.y = floorY - table.height / 2;
  Composite.add(
    engine.world,
    Bodies.rectangle(table.x, table.y, table.width, table.height, { isStatic: true, friction: 0.9 })
  );
  const tableTop = floorY - table.height;

  // A wobbly tower, widest problem at the bottom.
  const blockHeight = 34 * scale;
  let top = tableTop;
  const blocks = BACKLOG.map((label, index) => {
    const blockWidth = (label.length * 7.4 + 34) * scale;
    const y = top - blockHeight / 2;
    top -= blockHeight;
    const body = Bodies.rectangle(table.x + (index % 2 ? 3 : -3) * scale, y, blockWidth, blockHeight, {
      chamfer: { radius: 6 * scale },
      density: 0.0012,
      friction: 0.6,
      restitution: 0.1,
    });
    return { label, body, width: blockWidth, height: blockHeight };
  });
  Composite.add(engine.world, blocks.map((block) => block.body));

  const shippySize = 42 * scale;
  const anchor = { x: gutter + Math.max(70, inner * 0.15), y: floorY - 150 * scale };
  const shippy = Bodies.rectangle(anchor.x, anchor.y, shippySize, shippySize, {
    chamfer: { radius: 9 * scale },
    density: 0.006,
    restitution: 0.3,
    friction: 0.5,
    frictionAir: 0.004,
  });
  // Pin it after creation: a body created static never stores its real mass, so it could not be released later.
  M.Body.setStatic(shippy, true);
  Composite.add(engine.world, shippy);

  return { engine, shippy, shippySize, blocks, anchor, maxPull: 105 * scale, tableTop, table, scale };
}
