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

var Kalman = {
  version: '0.0.1'
};

KalmanModel = (function(){

  function KalmanModel(x_0,P_0,F_k,Q_k){
    this.x_k  = x_0;
    this.P_k  = P_0;
    this.F_k  = F_k;
    this.Q_k  = Q_k;
  }
  
  KalmanModel.prototype.update =  function(o){
    I = Matrix.I(this.P_k.rows());
    //init
    this.x_k_ = this.x_k;
    this.P_k_ = this.P_k;

    //Predict
    this.x_k_k_ = this.F_k.x(this.x_k_);
    this.P_k_k_ = this.F_k.x(this.P_k_.x(this.F_k.transpose()));

    //update
    this.y_k = o.z_k.subtract(this.H_k.x(this.x_k_k_));//observation residual
    this.S_k = this.H_k.x(P_k_k_.x(H_k.transpose())).add(R_k);//residual covariance
    this.K_k = this.P_k_k_.x(H_k.transpose().x(S_k.inverse()));//Optimal Kalman gain
    this.x_k = this.x_k_k_ + K_k.x(y_k);
    this.P_k = this.I.subtract(K_k.x(H_k)).x(P_k_k_);
  }
  
  return KalmanModel;
})();

KalmanObservation = (function(){

  function KalmanObservation(z_k,H_k,Q_k){
    this.z_k = z_k;//observation
    this.H_k = H_k;//observation model
    this.R_k = R_k;//observation noise covariance
  }
  
  return KalmanObservation;
})();