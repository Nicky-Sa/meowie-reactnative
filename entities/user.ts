import { Bookmark } from "@/entities/bookmark";

export type User = {
  id: number;
  email: string;
  isActive: boolean;
  createdAt: string;
  bookmarks: Bookmark[];
};
