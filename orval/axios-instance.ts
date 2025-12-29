import axios, { AxiosRequestConfig } from "axios";

// 1. Define your base URL (use your LAN IP if testing on a real device!)
export const AXIOS_INSTANCE = axios.create({
  baseURL: "http://localhost:5005",
});

// 2. Define the custom fetcher function Orval will use
export const customInstance = <T>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig,
): Promise<T> => {
  const source = axios.CancelToken.source();
  const promise = AXIOS_INSTANCE({
    ...config,
    ...options,
    cancelToken: source.token,
  }).then(({ data }) => data);

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  promise.cancel = () => {
    source.cancel("Query was cancelled");
  };

  return promise;
};
