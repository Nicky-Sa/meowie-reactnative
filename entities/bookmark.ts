import { User } from "@/entities/user";

export type Bookmark = {
  id: number;
  userId: number;
  tmdbId: number;
  createdAt: string;
  user: User;
};
