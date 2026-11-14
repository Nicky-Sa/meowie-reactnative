import { AxiosRequestConfig, isAxiosError } from "axios";
import {
  ErrorResponse,
  SuccessResponse,
} from "@/features/common/data/transformers";
import axiosInstance from "@/features/common/data/axios";
import { isErrorResponse, APICallError } from "@/features/common/data/error";

export type MutationArg<REQ> = {
  method: "POST" | "PUT" | "PATCH" | "DELETE";
  headers?: { [key: string]: string };
  body?: REQ;
};

export const fetcher = async <REQ, RES>(
  url: string,
  mutationArgs?: { arg: MutationArg<REQ> },
  options?: AxiosRequestConfig,
): Promise<SuccessResponse<RES>> => {
  const arg = mutationArgs?.arg;

  const config: AxiosRequestConfig = {
    url,
    method: arg?.method || "GET",
    headers: {
      "Content-Type": "application/json",
      ...arg?.headers,
    },
    data: arg?.body,
    ...options,
  };

  try {
    const response = await axiosInstance.request<
      SuccessResponse<RES> | ErrorResponse
    >(config);
    // --- This block only runs on a 2xx HTTP status ---
    return response.data as SuccessResponse<RES>;
  } catch (error) {
    // Anything that isn't a failed request, like a bug in our own code, passes through as it is.
    if (!isAxiosError(error)) throw error;

    const body: unknown = error.response?.data;
    if (isErrorResponse(body)) {
      throw new APICallError(body.errors, error.response?.status);
    }

    // No answer, or an answer that didn't come from our backend's error handling.
    throw new APICallError(error.message);
  }
};
