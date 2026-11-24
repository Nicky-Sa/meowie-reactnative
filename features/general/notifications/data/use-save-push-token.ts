import { useCallback } from "react";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { useMutationConfigured } from "@/features/common/data/query/hooks";
import { SavePushTokenReqDto } from "@/features/general/notifications/data/dto/save-push-token.dto";

const getPushToken = async (): Promise<string | null> => {
  const { status } = await Notifications.getPermissionsAsync();
  if (status !== Notifications.PermissionStatus.GRANTED) return null;

  const { data } = await Notifications.getExpoPushTokenAsync({
    projectId: Constants.easConfig?.projectId,
  });
  return data;
};

/** Gives back a function that saves this phone's push token and time zone, and logs its own errors. */
export const useSavePushToken = () => {
  const { mutateAsync, ...rest } = useMutationConfigured<
    SavePushTokenReqDto,
    undefined
  >("/device/current/push-token");

  const savePushToken = useCallback(async () => {
    try {
      const pushToken = await getPushToken();
      await mutateAsync({ method: "PUT", body: { pushToken } });
    } catch (error) {
      console.error("Could not save the push token:", error);
    }
  }, [mutateAsync]);

  return { savePushToken, ...rest };
};
