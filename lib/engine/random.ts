/** Small seeded PRNG (mulberry32) so mock data is reproducible. */
export type Rng = () => number;

export function createRng(seed: number): Rng {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const pick = <T,>(rng: Rng, items: readonly T[]): T =>
  items[Math.floor(rng() * items.length)];

export const between = (rng: Rng, min: number, max: number) =>
  min + (max - min) * rng();

export const int = (rng: Rng, min: number, max: number) =>
  Math.floor(between(rng, min, max + 1));

export function weighted<T>(rng: Rng, items: readonly { weight: number; value: T }[]): T {
  const total = items.reduce((s, i) => s + i.weight, 0);
  let r = rng() * total;
  for (const item of items) {
    r -= item.weight;
    if (r <= 0) return item.value;
  }
  return items[items.length - 1].value;
}

let counter = 0;
/** Short, sortable-ish id. Not cryptographic. */
export function makeId(prefix: string, rng: Rng = Math.random): string {
  counter = (counter + 1) % 1296;
  const rand = Math.floor(rng() * 36 ** 5)
    .toString(36)
    .padStart(5, "0");
  return `${prefix}_${rand}${counter.toString(36).padStart(2, "0")}`;
}
