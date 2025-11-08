import {
  ErrorResponse,
  SuccessResponse,
} from "@/features/general/dto/success.dto";

export type MutationArg<REQ> = {
  method: "POST" | "PUT" | "DELETE";
  headers?: { [key: string]: string };
  body?: REQ;
};

export async function fetcher<REQ, RES>(
  url: string,
  { arg }: { arg: MutationArg<REQ> },
): Promise<SuccessResponse<RES>> {
  return fetch(url, {
    method: arg?.method || "GET",
    headers: {
      "Content-Type": "application/json",
      ...arg?.headers,
    },
    body: arg?.body ? JSON.stringify(arg.body) : undefined,
  })
    .then((r) => r.json())
    .then((r: SuccessResponse<RES> | ErrorResponse) => {
      if (!r.success) {
        throw new Error(JSON.stringify(r.errors));
      }
      return r;
    });
}
