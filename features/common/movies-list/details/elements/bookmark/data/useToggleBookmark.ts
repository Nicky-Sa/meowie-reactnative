import {
  ToggleBookmarkReqDto,
  ToggleBookmarkResDto,
} from "@/features/common/movies-list/details/elements/bookmark/data/dto/toggle-bookmark.dto";
import { fetcher, MutationArg } from "@/features/common/data/fetcher";
import { SuccessResponse } from "@/features/common/data/transformers";
import useSWRMutation from "swr/mutation";
import { ID } from "@/features/common/data/query";

type Args = {
  id: ID;
};

export const useToggleBookmark = ({ id }: Args) => {
  const url = "/movie-states/bookmark";

  const {
    trigger: swrTrigger,
    data: response,
    ...rest
  } = useSWRMutation<
    SuccessResponse<ToggleBookmarkResDto>,
    Error,
    string,
    MutationArg<ToggleBookmarkReqDto>
  >(url, fetcher);

  const trigger = async () => {
    return swrTrigger(
      {
        method: "POST",
        body: { id: Number(id) },
      },
      {
        optimisticData: { data: { bookmarked: !response?.data.bookmarked } },
        rollbackOnError: true,
      },
    );
  };
  return { trigger, data: response?.data, ...rest };
};
