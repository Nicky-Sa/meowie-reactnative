import {
  DeleteUserReqDto,
  DeleteUserResDto,
} from "@/features/settings/delete-user/data/dto/delete-user.dto";
import { useMutationConfigured } from "@/features/common/data/query/hooks";
import { destroySession } from "@/features/common/data/utils/session";
import { queryClient } from "@/features/common/data/query/client";
import { useSetAtom } from "jotai";
import { RESET } from "jotai/utils";
import { homeTourSeenAtom, swipeGuideSeenAtom } from "@/atoms";
import { appStorage } from "@/features/common/data/utils/app-storage";
import { APP_STORAGE_KEYS } from "@/features/common/data/utils/storage-keys";
import Toast from "react-native-toast-message";

export const useDeleteUser = () => {
  const url = "/user/current";

  const { mutateAsync, ...rest } = useMutationConfigured<
    DeleteUserReqDto,
    DeleteUserResDto
  >(url);

  const setHomeTourSeen = useSetAtom(homeTourSeenAtom);
  const setSwipeGuideSeen = useSetAtom(swipeGuideSeenAtom);

  const trigger = async (body: DeleteUserReqDto) => {
    const response = await mutateAsync({ method: "DELETE", body });
    await destroySession();
    queryClient.clear();

    // resetting user-related items
    setHomeTourSeen(RESET);
    setSwipeGuideSeen(RESET);
    appStorage.removeItem(APP_STORAGE_KEYS.ONBOARDED);

    Toast.show({
      type: "info",
      text1: "Your account has been deleted successfully.",
    });

    return response.data;
  };
  return { trigger, ...rest };
};
