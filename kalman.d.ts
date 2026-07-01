export interface SylvesterVector {
  elements: number[];
  e(index: number): number | null;
  add(vector: SylvesterVector): SylvesterVector;
  subtract(vector: SylvesterVector): SylvesterVector;
}

export interface SylvesterMatrix {
  elements: number[][];
  e(row: number, column: number): number | null;
  rows(): number;
  x(matrix: SylvesterMatrix): SylvesterMatrix;
  x(vector: SylvesterVector): SylvesterVector;
  add(matrix: SylvesterMatrix): SylvesterMatrix;
  subtract(matrix: SylvesterMatrix): SylvesterMatrix;
  transpose(): SylvesterMatrix;
  inverse(): SylvesterMatrix;
}

export declare const Kalman: {
  version: string;
};

export declare class KalmanModel {
  constructor(
    x_0: SylvesterVector,
    P_0: SylvesterMatrix,
    F_k: SylvesterMatrix,
    Q_k: SylvesterMatrix
  );

  x_k: SylvesterVector;
  P_k: SylvesterMatrix;
  F_k: SylvesterMatrix;
  Q_k: SylvesterMatrix;

  I?: SylvesterMatrix;
  x_k_?: SylvesterVector;
  P_k_?: SylvesterMatrix;
  x_k_k_?: SylvesterVector;
  P_k_k_?: SylvesterMatrix;
  y_k?: SylvesterVector;
  S_k?: SylvesterMatrix;
  K_k?: SylvesterMatrix;

  predict(): void;
  correct(observation: KalmanObservation): void;
  update(observation: KalmanObservation): void;
}

export declare class KalmanObservation {
  constructor(
    z_k: SylvesterVector,
    H_k: SylvesterMatrix,
    R_k: SylvesterMatrix
  );

  z_k: SylvesterVector;
  H_k: SylvesterMatrix;
  R_k: SylvesterMatrix;
}

declare const api: {
  Kalman: typeof Kalman;
  KalmanModel: typeof KalmanModel;
  KalmanObservation: typeof KalmanObservation;
};

export default api;
