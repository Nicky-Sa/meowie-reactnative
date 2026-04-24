import * as Updates from "expo-updates";
import { useEffect, useRef } from "react";
import Toast from "react-native-toast-message";

export const UpdatesListener = () => {
  const { isUpdateAvailable, isUpdatePending, isDownloading, downloadError } =
    Updates.useUpdates();

  const isDownloadingToastShown = useRef(false);

  useEffect(() => {
    if (__DEV__) return;

    if (isUpdateAvailable && !isDownloading && !isUpdatePending) {
      void Updates.fetchUpdateAsync();
    }
  }, [isUpdateAvailable, isDownloading, isUpdatePending]);

  useEffect(() => {
    if (isDownloading && !isDownloadingToastShown.current) {
      isDownloadingToastShown.current = true;
      Toast.show({
        type: "info",
        text1: "Update available! 😺",
        text2: "Downloading the latest version",
      });
    }
  }, [isDownloading]);

  useEffect(() => {
    if (isUpdatePending) {
      Toast.show({
        type: "success",
        text1: "Update downloaded! 😻",
        text2: "Restarting to apply the changes",
      });

      // Wait a bit for the user to see the toast
      setTimeout(async () => {
        await Updates.reloadAsync();
      }, 3000);
    }
  }, [isUpdatePending]);

  useEffect(() => {
    if (downloadError) {
      console.error("Error downloading update:", downloadError);
    }
  }, [downloadError]);

  return null;
};
