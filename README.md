# Kalman

A small linear Kalman filter for JavaScript.

This project is being modernized. The `0.1.x` line keeps the original
Sylvester-compatible API while adding package metadata, CommonJS and ESM entry
points, TypeScript declarations, deterministic tests, and CI.

## Install

```sh
npm install @itamarwe/kalman
```

## Requirements

The compatibility API still expects a Sylvester-compatible matrix and vector
implementation. The objects passed to the filter must support the methods used
by Sylvester, including `x`, `add`, `subtract`, `transpose`, `inverse`, `rows`,
and vector/matrix element accessors.

## Usage

### CommonJS

```js
const { KalmanModel, KalmanObservation } = require('@itamarwe/kalman');
```

### ESM

```js
import { KalmanModel, KalmanObservation } from '@itamarwe/kalman';
```

### Browser Globals

```html
<script src="vendor/sylvester.src.js"></script>
<script src="kalman.js"></script>

<script>
var x_0 = $V([-10]);
var P_0 = $M([[1]]);
var F_k = $M([[1]]);
var Q_k = $M([[0]]);
var model = new KalmanModel(x_0, P_0, F_k, Q_k);

var z_k = $V([1]);
var H_k = $M([[1]]);
var R_k = $M([[4]]);
var observation = new KalmanObservation(z_k, H_k, R_k);

model.update(observation);

console.log(model.x_k.elements);
</script>
```

## Examples

- [Device orientation smoothing](examples/device-orientation.html) shows a full
  browser example for smoothing `deviceorientation` `alpha`, `beta`, and
  `gamma` readings. It includes a real sensor listener, sample data for desktop
  testing, angle unwrapping for `0`/`360` crossings, and comments explaining
  each Kalman matrix.

For direct orientation smoothing, the common mapping is:

| Value | Meaning |
| --- | --- |
| `x_0` | Initial state estimate, for example `$V([alpha, beta, gamma])`. |
| `P_0` | Initial uncertainty in that state estimate. |
| `F_k` | State transition. Identity means the next angle starts near the previous angle. |
| `Q_k` | Process noise. Increase this when real motion changes quickly and the filter lags. |
| `z_k` | Current sensor measurement. Update this on every sensor event. |
| `H_k` | Observation model. Identity works when the measured angles map directly to the state. |
| `R_k` | Measurement noise. Increase this for noisy channels, such as a jumpy alpha reading. |

## API

### `new KalmanModel(x_0, P_0, F_k, Q_k)`

Creates a filter model with initial state `x_0`, initial covariance `P_0`,
state transition model `F_k`, and process noise covariance `Q_k`.

### `new KalmanObservation(z_k, H_k, R_k)`

Creates an observation with measurement `z_k`, observation model `H_k`, and
observation noise covariance `R_k`.

### `model.predict()`

Runs the prediction step and stores the predicted state in `model.x_k_k_` and
predicted covariance in `model.P_k_k_`.

### `model.correct(observation)`

Runs the correction step against the most recent prediction and updates
`model.x_k` and `model.P_k`.

### `model.update(observation)`

Runs the current predict-and-correct step and updates `model.x_k` and
`model.P_k`. This is equivalent to calling `model.predict()` followed by
`model.correct(observation)`.

## Development

```sh
npm test
```

The test suite loads the vendored Sylvester build the same way the original
browser test did, then verifies deterministic scalar filter behavior and module
exports.

## Modernization Roadmap

- Add a modern dependency-light matrix layer or adapter API.
- Improve numerical stability by avoiding direct inverses where possible.
- Publish a migration guide from the compatibility API to the modern API.

## License

MIT. See [LICENSE](LICENSE).

The vendored `vendor/sylvester.src.js` file is MIT licensed by James Coglan and
is used for compatibility tests and examples.
