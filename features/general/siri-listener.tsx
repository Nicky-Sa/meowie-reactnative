import * as AppIntents from "expo-app-intents";
import { Href, usePathname, useRouter } from "expo-router";
import { useSetAtom } from "jotai";
import { linkToOpenAtom } from "@/atoms";
import { isMediaType } from "@/features/common/data/models/media-type";
import { MediaAction } from "@/features/media/data/media-actions";

const ACTION_FOR_SIRI_COMMAND: Record<string, MediaAction | undefined> = {
  saveMedia: "save",
};

const getActionLink = (
  action: MediaAction,
  params: AppIntents.AppIntentInvocation["params"],
): Href | null => {
  const { id, mediaType } = params;
  if (typeof id !== "number" || !isMediaType(mediaType)) return null;

  return `/${mediaType}/${id}/details?action=${action}`;
};

export const SiriListener = () => {
  const router = useRouter();
  const pathname = usePathname();
  const setLinkToOpen = useSetAtom(linkToOpenAtom);

  AppIntents.useAppIntents(async (pendingIntents) => {
    for (const invocation of pendingIntents) {
      const action = ACTION_FOR_SIRI_COMMAND[invocation.name];
      if (!action) continue;

      const link = getActionLink(action, invocation.params);
      if (!link) {
        console.error("Siri sent a request the app can't open:", invocation);
      } else if (pathname === "/") {
        // The init screen replaces itself with Home, so it opens the link after that.
        setLinkToOpen(link);
      } else {
        router.push(link);
      }

      try {
        await AppIntents.removePendingInvocationAsync(invocation.id);
      } catch (error) {
        console.error("Could not remove the Siri request:", error);
      }
    }
  });

  return null;
};
