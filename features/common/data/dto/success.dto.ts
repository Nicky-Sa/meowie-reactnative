export type SuccessResponse<T> = {
  success: true;
  statusCode: number;
  data: T;
  timestamp: string;
};

export type ErrorResponse = {
  success: false;
  statusCode: number;
  errors: string[];
  timestamp: string;
};
