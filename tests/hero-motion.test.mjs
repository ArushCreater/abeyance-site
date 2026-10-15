import assert from 'node:assert/strict';
import { test } from 'node:test';
import { storyChapter } from '../lib/hero-motion.mjs';
import { demoDecision } from '../lib/policy-demo.mjs';
import { createApertureRig } from '../components/landing/aperture-scene.ts';

test('trackpad jitter does not flash the payment status', () => {
  for (let chapter = 0; chapter < 3; chapter++) {
    const edge = (chapter + 1) / 4;
    for (const delta of [-.01, .01, 0, -.015, .02]) {
      assert.equal(storyChapter(edge + delta, chapter), chapter);
      assert.equal(storyChapter(edge + delta, chapter + 1), chapter + 1);
    }
  }
  assert.equal(storyChapter(1, 0), 3);
  assert.equal(storyChapter(0, 3), 0);
});
test('scroll transforms leave the brand geometry immutable and inexpensive', () => {
  const rig = createApertureRig(); const geometry = new Map(); let meshes = 0, triangles = 0;
  rig.scene.traverse(object => {
    if (!object.isMesh) return; meshes++;
    const g = object.geometry; triangles += (g.index?.count ?? g.attributes.position.count) / 3;
    geometry.set(g, { positions: g.attributes.position.array.slice(), normals: g.attributes.normal.array.slice() });
  });
  assert.ok(meshes <= 5, `${meshes} draw objects`);
  assert.ok(triangles < 20000, `${triangles} triangles`);
  for (let i = 0; i <= 240; i++) rig.update(i / 240, { x: .3, y: -.2 });
  for (const [g, before] of geometry) { assert.deepEqual(g.attributes.position.array, before.positions); assert.deepEqual(g.attributes.normal.array, before.normals); }
  rig.dispose();
});
test('the aperture and action really stop during HOLD', () => {
  const rig = createApertureRig();
  rig.update(.28); rig.scene.updateMatrixWorld(true);
  const before = new Map(); rig.scene.traverse(o => { if (o.isMesh) before.set(o, o.matrixWorld.elements.slice()); });
  rig.update(.48); rig.scene.updateMatrixWorld(true);
  for (const [object, matrix] of before) assert.deepEqual(object.matrixWorld.elements, matrix, `${object.name || 'action'} moved during HOLD`);
  rig.dispose();
});
test('fast or reverse scrolling retraces the same continuous pose', () => {
  const rig = createApertureRig();
  const nodes = ['aperture', 'ribbon-0', 'ribbon-1', 'ribbon-2', 'action'].map(name => rig.scene.getObjectByName(name));
  for (const edge of [.2, .5, .54, .71, .8, .82, .94, 1]) {
    rig.update(edge - .0001); rig.scene.updateMatrixWorld(true);
    const before = nodes.map(n => n.matrixWorld.elements.slice());
    rig.update(edge + .0001); rig.scene.updateMatrixWorld(true);
    nodes.forEach((n, i) => n.matrixWorld.elements.forEach((v, j) => assert.ok(Number.isFinite(v) && Math.abs(v - before[i][j]) < .02, `${n.name} jumps at ${edge}`)));
  }
  rig.update(.65); rig.scene.updateMatrixWorld(true); const pose = nodes.map(n => n.matrixWorld.elements.slice());
  rig.update(1); rig.update(0); rig.update(.65); rig.scene.updateMatrixWorld(true);
  nodes.forEach((n, i) => assert.deepEqual(n.matrixWorld.elements, pose[i]));
  rig.dispose();
});
test('the interactive policy example respects the exact payment boundary', () => {
  assert.equal(demoDecision('payment.send', 500).outcome, 'ALLOW');
  assert.equal(demoDecision('payment.send', 501).outcome, 'HOLD');
  assert.equal(demoDecision('payment.send', 0).outcome, 'ALLOW');
});
test('email and delete examples use the visible action context', () => {
  assert.equal(demoDecision('email.send', 600, true).outcome, 'HOLD');
  assert.equal(demoDecision('email.send', 600, false).outcome, 'ALLOW');
  assert.equal(demoDecision('file.delete', 600, true, 'production').outcome, 'BLOCK');
  assert.equal(demoDecision('file.delete', 600, true, 'development').outcome, 'ALLOW');
});
