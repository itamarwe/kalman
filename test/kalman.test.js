'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { test } = require('node:test');
const vm = require('node:vm');
const { pathToFileURL } = require('node:url');

const root = path.join(__dirname, '..');
const sylvesterPath = path.join(root, 'vendor', 'sylvester.src.js');
const kalmanPath = path.join(root, 'kalman.js');

vm.runInThisContext(fs.readFileSync(sylvesterPath, 'utf8'), {
  filename: sylvesterPath
});

const {
  Kalman,
  KalmanModel,
  KalmanObservation
} = require('../kalman.js');

function assertClose(actual, expected, tolerance = 1e-12) {
  assert.ok(
    Math.abs(actual - expected) <= tolerance,
    `expected ${actual} to be within ${tolerance} of ${expected}`
  );
}

function createScalarModel() {
  return new KalmanModel(
    $V([-10]),
    $M([[1]]),
    $M([[1]]),
    $M([[0]])
  );
}

function createScalarObservation(measurement) {
  return new KalmanObservation(
    $V([measurement]),
    $M([[1]]),
    $M([[4]])
  );
}

test('exports the compatibility API for CommonJS users', () => {
  assert.equal(Kalman.version, '0.1.0');
  assert.equal(typeof KalmanModel, 'function');
  assert.equal(typeof KalmanObservation, 'function');
});

test('exports the compatibility API for ESM users', async () => {
  const module = await import(pathToFileURL(path.join(root, 'kalman.mjs')).href);

  assert.equal(module.Kalman.version, '0.1.0');
  assert.equal(module.default.KalmanModel, module.KalmanModel);
  assert.equal(module.default.KalmanObservation, module.KalmanObservation);
});

test('updates scalar state and covariance deterministically', () => {
  const model = createScalarModel();
  const observation = createScalarObservation(1);

  model.update(observation);

  assertClose(model.x_k.e(1), -7.8);
  assertClose(model.P_k.e(1, 1), 0.8);
  assertClose(model.y_k.e(1), 11);
  assertClose(model.S_k.e(1, 1), 5);
  assertClose(model.K_k.e(1, 1), 0.2);
});

test('supports split predict and correct steps', () => {
  const model = createScalarModel();
  const observation = createScalarObservation(1);

  model.predict();

  assertClose(model.x_k_k_.e(1), -10);
  assertClose(model.P_k_k_.e(1, 1), 1);

  model.correct(observation);

  assertClose(model.x_k.e(1), -7.8);
  assertClose(model.P_k.e(1, 1), 0.8);
});

test('preserves current behavior across repeated scalar updates', () => {
  const model = createScalarModel();
  const observation = createScalarObservation(1);

  for (const measurement of [1, 0.5, 1.5]) {
    observation.z_k = $V([measurement]);
    model.update(observation);
  }

  assertClose(model.x_k.e(1), -37 / 7);
  assertClose(model.P_k.e(1, 1), 4 / 7);
});

test('attaches globals when loaded as browser scripts', () => {
  const sandbox = {
    console: {
      log() {}
    }
  };
  sandbox.globalThis = sandbox;
  vm.createContext(sandbox);

  vm.runInContext(fs.readFileSync(sylvesterPath, 'utf8'), sandbox, {
    filename: sylvesterPath
  });
  vm.runInContext(fs.readFileSync(kalmanPath, 'utf8'), sandbox, {
    filename: kalmanPath
  });

  assert.equal(sandbox.Kalman.version, '0.1.0');
  assert.equal(typeof sandbox.KalmanModel, 'function');
  assert.equal(typeof sandbox.KalmanObservation, 'function');

  const model = new sandbox.KalmanModel(
    sandbox.$V([-10]),
    sandbox.$M([[1]]),
    sandbox.$M([[1]]),
    sandbox.$M([[0]])
  );
  const observation = new sandbox.KalmanObservation(
    sandbox.$V([1]),
    sandbox.$M([[1]]),
    sandbox.$M([[4]])
  );

  model.update(observation);

  assertClose(model.x_k.e(1), -7.8);
  assertClose(model.P_k.e(1, 1), 0.8);
});
