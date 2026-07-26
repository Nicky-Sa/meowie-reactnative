import { ReleaseNoteResDto } from "@/features/release-notes/data/dto/release-notes.dto";
import { useQueryConfigured } from "@/features/common/data/query/hooks";

export const useFetchReleaseNotes = () => {
  const url = "/release-notes";
  const { data: response, ...rest } =
    useQueryConfigured<ReleaseNoteResDto[]>(url);
  const data = response?.data ?? [];
  return {
    data,
    ...rest,
  };
};
