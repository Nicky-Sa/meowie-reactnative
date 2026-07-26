import { useAtomValue } from "jotai";
import { lastSeenReleaseNoteAtAtom } from "@/atoms";
import { useFetchReleaseNotes } from "@/features/release-notes/data/use-fetch-release-notes";

/** True when the newest release note is newer than the last one the user opened. */
export const useReleaseNotesSeen = () => {
  const { data } = useFetchReleaseNotes();
  const lastSeenAt = useAtomValue(lastSeenReleaseNoteAtAtom);

  const newest = data?.[0];
  if (!newest) return false;
  if (!lastSeenAt) return true;
  return new Date(newest.createdAt).getTime() > new Date(lastSeenAt).getTime();
};
