interface BaseResult {
  success: boolean;
  message?: string;
}

export interface SuccessResult<T> extends BaseResult {
  success: true;
  data: T;
}

export interface ErrorResult extends BaseResult {
  success: false;
  error: string;
}

export type OperationResult<T> = SuccessResult<T> | ErrorResult;
