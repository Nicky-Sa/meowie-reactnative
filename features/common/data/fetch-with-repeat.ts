import { AxiosRequestConfig } from "axios";
import { fetcher } from "@/features/common/data/fetcher";
import { SuccessResponse } from "@/features/common/data/transformers";

type RepeatOptions<Data> = {
  isReady: (data: Data) => boolean;
  intervalMs: number;
  maxRepeats: number;
  timeoutErrorMessage: string;
};

export const fetchWithRepeat = async <Data>(
  url: string,
  { isReady, intervalMs, maxRepeats, timeoutErrorMessage }: RepeatOptions<Data>,
  options?: AxiosRequestConfig,
): Promise<SuccessResponse<Data>> => {
  for (let repeat = 0; repeat <= maxRepeats; repeat++) {
    if (options?.signal?.aborted) throw new Error("Request cancelled.");

    const response = await fetcher<unknown, Data>(url, undefined, options);
    if (options?.signal?.aborted) throw new Error("Request cancelled.");
    if (isReady(response.data)) return response;
    if (repeat === maxRepeats) break;

    await new Promise<void>((finish) => setTimeout(finish, intervalMs));
  }

  throw new Error(timeoutErrorMessage);
};
