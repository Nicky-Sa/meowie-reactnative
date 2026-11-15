/** A preparing feed has no titles yet; request again shortly. */
export type FeedResponse = {
  results: number[];
  status: "ready" | "preparing";
};
