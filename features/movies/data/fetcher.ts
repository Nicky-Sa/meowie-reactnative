import {
  ErrorResponse,
  SuccessResponse,
} from "@/features/general/dto/success.dto";

export const fetcher = async <T>(url: string): Promise<SuccessResponse<T>> => {
  return fetch(url)
    .then((r) => r.json())
    .then((r: SuccessResponse<T> | ErrorResponse) => {
      if (!r.success) {
        throw new Error(JSON.stringify((r as ErrorResponse).errors));
      }
      return r as SuccessResponse<T>;
    });
};
