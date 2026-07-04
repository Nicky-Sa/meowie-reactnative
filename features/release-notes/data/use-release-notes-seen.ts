import { useCallback } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import { lastSeenReleaseNoteAtAtom } from "@/atoms";
import { useFetchReleaseNotes } from "@/features/release-notes/data/use-fetch-release-notes";
import { ReleaseNoteResDto } from "@/features/release-notes/data/dto/release-notes.dto";

/** True when the newest release note is newer than the last one the user opened. */
export const useHasUnseenReleaseNote = () => {
  const { data } = useFetchReleaseNotes();
  const lastSeenAt = useAtomValue(lastSeenReleaseNoteAtAtom);

  const newest = data?.[0];
  if (!newest) return false;
  if (!lastSeenAt) return true;
  return new Date(newest.createdAt).getTime() > new Date(lastSeenAt).getTime();
};

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
