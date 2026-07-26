import { useCallback } from "react";
import { useSetAtom } from "jotai";
import { lastSeenReleaseNoteAtAtom } from "@/atoms";
import { ReleaseNoteResDto } from "@/features/release-notes/data/dto/release-notes.dto";

/** Marks the newest note as seen, which clears the badge. */
export const useMarkReleaseNotesSeen = () => {
  const setLastSeenAt = useSetAtom(lastSeenReleaseNoteAtAtom);

  return useCallback(
    (notes: ReleaseNoteResDto[] | undefined) => {
      const newest = notes?.[0];
      if (newest) setLastSeenAt(newest.createdAt);
    },
    [setLastSeenAt],
  );
};
