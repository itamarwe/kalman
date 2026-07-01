// === Kalman ===
// Kalman filter for Javascript
// Copyright (c) 2012 Itamar Weiss
// 
// Permission is hereby granted, free of charge, to any person obtaining
// a copy of this software and associated documentation files (the "Software"),
// to deal in the Software without restriction, including without limitation
// the rights to use, copy, modify, merge, publish, distribute, sublicense,
// and/or sell copies of the Software, and to permit persons to whom the
// Software is furnished to do so, subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
// THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
// FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
// DEALINGS IN THE SOFTWARE.

(function(root, factory) {
  var api = factory(root);

  if (typeof module === 'object' && module.exports) {
    module.exports = api;
  }

  if (root) {
    root.Kalman = api.Kalman;
    root.KalmanModel = api.KalmanModel;
    root.KalmanObservation = api.KalmanObservation;
  }
}(typeof globalThis !== 'undefined' ? globalThis : this, function(root) {
  'use strict';

  var Kalman = {
    version: '0.1.0'
  };

  function getMatrix() {
    if (root && root.Matrix) {
      return root.Matrix;
    }

    throw new Error('Kalman requires a Sylvester-compatible Matrix implementation.');
  }

  var KalmanModel = (function() {

    function KalmanModel(x_0, P_0, F_k, Q_k) {
      this.x_k = x_0;
      this.P_k = P_0;
      this.F_k = F_k;
      this.Q_k = Q_k;
    }

    KalmanModel.prototype.predict = function() {
      //init
      this.x_k_ = this.x_k;
      this.P_k_ = this.P_k;

      //Predict
      this.x_k_k_ = this.F_k.x(this.x_k_);
      this.P_k_k_ = this.F_k.x(this.P_k_.x(this.F_k.transpose())).add(this.Q_k);
    };

    KalmanModel.prototype.correct = function(o) {
      this.I = getMatrix().I(this.P_k.rows());
      //update
      this.y_k = o.z_k.subtract(o.H_k.x(this.x_k_k_));//observation residual
      this.S_k = o.H_k.x(this.P_k_k_.x(o.H_k.transpose())).add(o.R_k);//residual covariance
      this.K_k = this.P_k_k_.x(o.H_k.transpose().x(this.S_k.inverse()));//Optimal Kalman gain
      this.x_k = this.x_k_k_.add(this.K_k.x(this.y_k));
      this.P_k = this.I.subtract(this.K_k.x(o.H_k)).x(this.P_k_k_);
    };

    KalmanModel.prototype.update = function(o) {
      this.predict();
      this.correct(o);
    };

    return KalmanModel;
  })();

  var KalmanObservation = (function() {

    function KalmanObservation(z_k, H_k, R_k) {
      this.z_k = z_k;//observation
      this.H_k = H_k;//observation model
      this.R_k = R_k;//observation noise covariance
    }

    return KalmanObservation;
  })();

  return {
    Kalman: Kalman,
    KalmanModel: KalmanModel,
    KalmanObservation: KalmanObservation
  };
}));
