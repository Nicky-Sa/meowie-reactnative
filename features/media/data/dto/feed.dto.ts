/** A preparing feed has no titles yet; request another batch shortly. */
export type FeedResponse = {
  results: number[];
  status: "ready" | "preparing";
};
