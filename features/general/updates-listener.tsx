import * as Updates from "expo-updates";
import { useEffect } from "react";
import Toast from "react-native-toast-message";

const isMarkedUrgent = (update: Updates.UpdateInfo | undefined) => {
  const manifest = update?.manifest;
  if (!manifest || !("extra" in manifest)) return false;

  return manifest.extra?.expoClient?.extra?.updateIsUrgent === true;
};

export const UpdatesListener = () => {
  const {
    isUpdateAvailable,
    isUpdatePending,
    isDownloading,
    downloadedUpdate,
    downloadError,
  } = Updates.useUpdates();

  useEffect(() => {
    if (__DEV__) return;

    if (isUpdateAvailable && !isDownloading && !isUpdatePending) {
      void Updates.fetchUpdateAsync();
    }
  }, [isUpdateAvailable, isDownloading, isUpdatePending]);

  // Only urgent updates restart the app. Everything else waits for the next
  // cold start, which picks up the new bundle without any restart at all.
  useEffect(() => {
    if (!isUpdatePending || !isMarkedUrgent(downloadedUpdate)) return;

    Toast.show({
      type: "success",
      text1: "Update downloaded! 😻",
      text2: "Restarting to apply the changes",
    });

    // Wait a bit for the user to see the toast
    const timer = setTimeout(() => {
      void Updates.reloadAsync();
    }, 3000);

    return () => clearTimeout(timer);
  }, [isUpdatePending, downloadedUpdate]);

  useEffect(() => {
    if (downloadError) {
      console.error("Error downloading update:", downloadError);
    }
  }, [downloadError]);

  return null;
};
