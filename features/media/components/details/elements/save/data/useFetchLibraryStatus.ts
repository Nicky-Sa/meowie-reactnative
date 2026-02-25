import { useSWRConfigured } from "@/features/common/data/swr/hooks";
import { ID } from "@/features/common/data/media-query";
import { useCurrentUser } from "@/features/general/data/useCurrentUser";
import { MediaType } from "@/features/common/data/models/media-type";
import { LibraryStatusResDto } from "@/features/profile/data/dto/library.dto";

type Args = {
  id: ID;
  mediaType: MediaType;
};

/**
 * Fetches the library status for the given item.
 * @note Protected route: If the user is not logged in, it won't fetch anything.
 */
export const useFetchLibraryStatus = ({ id, mediaType }: Args) => {
  const { data } = useCurrentUser();
  const url = data?.user ? `/library/status/${mediaType}/${id}` : null;
  const { data: response, ...rest } =
    useSWRConfigured<LibraryStatusResDto>(url);

  return {
    data: response?.data,
    ...rest,
  };
};
