export type CreditJob = "cast" | "crew" | "director" | "creator";

export type CreditInfo = {
  id: number;
  name: string;
  role: string;
  job: CreditJob;
  creditId: string;
  profilePath: string;
};
