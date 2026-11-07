export type ReleaseNoteMediaType = "image" | "video";

export type ReleaseNoteResDto = {
  id: number;
  title: string;
  points: string[];
  mediaUrl: string | null;
  mediaType: ReleaseNoteMediaType | null;
  version: string;
  createdAt: string;
};
