export type WatchProvider = {
  logoPath: string;
  providerId: number;
  providerName: string;
};

export type WatchProviders = {
  flatrate: WatchProvider[];
  rent: WatchProvider[];
  buy: WatchProvider[];
  tmdbLink: string;
};
