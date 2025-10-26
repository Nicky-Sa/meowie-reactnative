export type Success<T> = {
  success: true;
  statusCode: number;
  data: T;
  timestamp: string;
};
