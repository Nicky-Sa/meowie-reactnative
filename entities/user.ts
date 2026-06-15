import { Saved } from "@/entities/saved";

export type User = {
  id: number;
  email: string;
  isActive: boolean;
  createdAt: string;
  hasFilledInTaste: boolean;
  saved: Saved[];
};
