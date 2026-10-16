import assert from 'node:assert/strict';
import { test } from 'node:test';
import { demoDecision } from '../lib/policy-demo.mjs';

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
