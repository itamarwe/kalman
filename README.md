# Kalman

Kalman filter for Javascript.

## Dependencies
The module requires a sylvester.js (https://github.com/jcoglan/sylvester) compatible matrix and vector manipulation module.

## Usage
Using the Kalman Filter module is very simple:

```html
<script type="text/javascript" src="sylvester.src.js"></script>
<script type="text/javascript" src="../kalman.js"></script>

<script type="text/javascript">
var x_0 = $V([-10]);
var P_0 = $M([[1]]);
var F_k=$M([[1]]);
var Q_k=$M([[0]]);
var KM = new KalmanModel(x_0,P_0,F_k,Q_k);

var z_k = $V([1]);
var H_k = $M([[1]]);
var R_k = $M([[4]]);
var KO = new KalmanObservation(z_k,H_k,R_k);

for (var i=0;i<200;i++){
  z_k = $V([0.5+Math.random()]);
  KO.z_k=z_k;
  KM.update(KO);
  console.log(JSON.stringify(KM.x_k.elements));
}
</script>
```
## License

(The MIT License)

Copyright (c) 2007-2012 James Coglan

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the 'Software'), to deal in
the Software without restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the
Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.