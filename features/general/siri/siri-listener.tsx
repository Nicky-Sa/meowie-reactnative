import * as AppIntents from "expo-app-intents";
import { Href, usePathname, useRouter } from "expo-router";
import { useSetAtom } from "jotai";
import { linkToOpenAtom } from "@/atoms";
import { isMediaType } from "@/features/common/data/models/media-type";
import { MediaAction } from "@/features/media/data/media-actions";
import { useAnalytics } from "@/features/general/posthog/hook/use-analytics";
import {
  isSiriCommand,
  SiriCommand,
  SiriParams,
} from "@/features/general/siri/types";

const getMediaActionLink = (
  action: MediaAction,
  { id, mediaType }: SiriParams,
): Href | null => {
  if (typeof id !== "number" || !isMediaType(mediaType)) return null;

  return `/${mediaType}/${id}/details?action=${action}`;
};

const getSearchLink = ({ query }: SiriParams): Href | null => {
  if (typeof query !== "string" || !query.trim()) return null;

  return { pathname: "/search", params: { query } };
};

const LINK_FOR_SIRI_COMMAND: Record<
  SiriCommand,
  (params: SiriParams) => Href | null
> = {
  saveMedia: (params) => getMediaActionLink("save", params),
  searchMedia: getSearchLink,
};

export const SiriListener = () => {
  const router = useRouter();
  const pathname = usePathname();
  const setLinkToOpen = useSetAtom(linkToOpenAtom);
  const { siri } = useAnalytics();

  AppIntents.useAppIntents(async (pendingIntents) => {
    for (const invocation of pendingIntents) {
      if (!isSiriCommand(invocation.name)) continue;

      const link = LINK_FOR_SIRI_COMMAND[invocation.name](invocation.params);
      siri.trackCommandReceived({
        command: invocation.name,
        opened: link !== null,
      });
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
