import { AxiosRequestConfig, isAxiosError } from "axios";
import {
  ErrorResponse,
  SuccessResponse,
} from "@/features/common/data/transformers";
import axiosInstance from "@/features/common/data/axios";

export type MutationArg<REQ> = {
  method: "POST" | "PUT" | "DELETE";
  headers?: { [key: string]: string };
  body?: REQ;
};

export async function fetcher<REQ, RES>(
  url: string,
  mutationArgs?: { arg: MutationArg<REQ> },
): Promise<SuccessResponse<RES>> {
  const arg = mutationArgs?.arg;

  const config: AxiosRequestConfig = {
    url,
    method: arg?.method || "GET",
    headers: {
      "Content-Type": "application/json",
      ...arg?.headers,
    },
    data: arg?.body,
  };

  return axiosInstance
    .request<SuccessResponse<RES> | ErrorResponse>(config)
    .then((response) => {
      // --- This block only runs on a 2xx HTTP status ---
      const res = response.data;
      return res as SuccessResponse<RES>;
    })
    .catch((error) => {
      // --- This block runs on any 4xx/5xx HTTP status ---

      // Check if it's an Axios error and has the response data
      if (isAxiosError(error) && error.response?.data) {
        // Extract the error data
        const res = error.response.data as ErrorResponse;

        // Throw the error in the format SWR expects
        throw new Error(res.errors);
      }

      // Fallback for network errors or other issues
      throw new Error(error.message || "An unknown error occurred");
    });
}
