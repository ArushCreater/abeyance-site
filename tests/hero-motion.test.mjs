import assert from 'node:assert/strict';
import { test } from 'node:test';
import { storyChapter } from '../lib/hero-motion.mjs';
import { createAgentRig } from '../components/landing/mascot-scene.ts';

test('trackpad jitter around chapter boundaries does not flash between messages', () => {
  for (let chapter = 0; chapter < 3; chapter++) {
    const edge = (chapter + 1) / 4;
    for (const delta of [-.01, .01, 0, -.015, .02]) {
      assert.equal(storyChapter(edge + delta, chapter), chapter);
      assert.equal(storyChapter(edge + delta, chapter + 1), chapter + 1);
    }
  }
});
test('fast jumps and reverse scrolling reach the correct chapter', () => {
  assert.equal(storyChapter(1, 0), 3);
  assert.equal(storyChapter(0, 3), 0);
  let current = 0; const changes = [];
  for (let p = 0; p <= 1; p += .001) { const next = storyChapter(p, current); if (next !== current) changes.push(next); current = next; }
  assert.deepEqual(changes, [1, 2, 3]);
});
test('animation keeps geometry immutable and within its drawing budget', () => {
  const rig = createAgentRig(); const geometry = new Map(); let meshes = 0, triangles = 0;
  rig.scene.traverse((object) => {
    if (!object.isMesh) return; meshes++;
    const g = object.geometry; triangles += (g.index?.count ?? g.attributes.position.count) / 3;
    geometry.set(g, { positions: g.attributes.position.array.slice(), normals: g.attributes.normal.array.slice() });
  });
  assert.ok(meshes < 70, `${meshes} draw objects`);
  assert.ok(triangles < 35000, `${triangles} triangles`);
  for (let i = 0; i <= 240; i++) rig.update(i / 240, i / 60, { x: .3, y: -.2 });
  for (const [g, before] of geometry) { assert.deepEqual(g.attributes.position.array, before.positions); assert.deepEqual(g.attributes.normal.array, before.normals); }
  rig.dispose();
});
test('joint and prop positions stay continuous through pause, release and audit', () => {
  const rig = createAgentRig();
  const nodes = ['agent', 'head', 'right-hand', 'left-hand', 'payment', 'proof'].map((name) => rig.scene.getObjectByName(name));
  for (const edge of [.14, .28, .43, .47, .54, .56, .76, .78, .93]) {
    rig.update(edge - .0001, 1, { x: 0, y: 0 }); rig.scene.updateMatrixWorld(true);
    const before = nodes.map((n) => n.matrixWorld.elements.slice());
    rig.update(edge + .0001, 1, { x: 0, y: 0 }); rig.scene.updateMatrixWorld(true);
    nodes.forEach((n, i) => n.matrixWorld.elements.forEach((v, j) => assert.ok(Number.isFinite(v) && Math.abs(v - before[i][j]) < .02, `${n.name} jumps at ${edge}`)));
  }
  rig.dispose();
});
test('the agent holds its pose while approval is pending', () => {
  const rig = createAgentRig();
  rig.update(.34, 1, { x: 0, y: 0 }); rig.scene.updateMatrixWorld(true);
  const before = new Map(); rig.scene.traverse(o => { if (o.isMesh) before.set(o, o.matrixWorld.elements.slice()); });
  rig.update(.34, 6, { x: 0, y: 0 }); rig.scene.updateMatrixWorld(true);
  for (const [object, matrix] of before) assert.deepEqual(object.matrixWorld.elements, matrix, `${object.name || 'mesh'} moved during HOLD`);
  rig.dispose();
});
