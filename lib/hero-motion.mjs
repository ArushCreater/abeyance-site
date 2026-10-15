/** Hold the current chapter near a boundary so trackpad jitter cannot flash the copy. */
/** @param {number} progress @param {number} current */
export function storyChapter(progress, current) {
  const p = Math.max(0, Math.min(1, Number.isFinite(progress) ? progress : 0));
  let next = current;
  while (next < 3 && p > (next + 1) / 4 + .025) next++;
  while (next > 0 && p < next / 4 - .025) next--;
  return next;
}

/** @param {number} from @param {number} to @param {number} value */
export function smooth(from, to, value) {
  const t = Math.max(0, Math.min(1, (value - from) / (to - from)));
  return t * t * (3 - 2 * t);
}
