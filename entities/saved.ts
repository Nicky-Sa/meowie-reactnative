import { User } from "@/entities/user";

export type Saved = {
  id: number;
  userId: number;
  tmdbId: number;
  createdAt: string;
  user: User;
};
