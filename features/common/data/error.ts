import { ErrorResponse } from "@/features/common/data/transformers";

/**
 * Thrown by `fetcher` when a request fails. `status` is set only when our
 * backend answered with its error format, so `message` is safe to show.
 */
export class APICallError extends Error {
  constructor(
    message: string,
    readonly status?: number,
  ) {
    super(message);
    this.name = "APICallError";
  }
}

export const isErrorResponse = (body: unknown): body is ErrorResponse =>
  typeof body === "object" &&
  body !== null &&
  "errors" in body &&
  typeof body.errors === "string";

/**
 * The text to show the person when an action or a load fails.
 * `fallbackText` is shown for any error that isn't an `APICallError`.
 */
export const getErrorText = (
  error: unknown,
  fallbackText = "Something went wrong. Try again.",
) => {
  if (!(error instanceof APICallError)) return fallbackText;
  if (error.status) return error.message;
  return `We couldn't reach Meowie.\nCheck your connection and try again.`;
};
