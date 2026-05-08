import { View, Text, Pressable } from "react-native";
import { NavArrowRight } from "iconoir-react-native";
import { Icon } from "@/features/common/ui/icon";
import * as WebBrowser from "expo-web-browser";
import * as Haptics from "expo-haptics";
import Toast from "react-native-toast-message";
import { ID } from "@/features/common/data/media-query";
import { MediaType } from "@/features/common/data/models/media-type";
import { useAnalytics } from "@/features/general/posthog/hook/use-analytics";
import Popcorn from "@/assets/images/meowie/popcorn.svg";

type Props = {
  ticketLink?: string;
  mediaId: ID;
  mediaType: MediaType;
};

export const Tickets = ({ ticketLink, mediaId, mediaType }: Props) => {
  const { media } = useAnalytics();
  if (!ticketLink) return null;

  const handlePress = async () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    try {
      media.trackTicketsClicked({ mediaId, mediaType });
      await WebBrowser.openBrowserAsync(ticketLink, {
        presentationStyle: WebBrowser.WebBrowserPresentationStyle.PAGE_SHEET,
      });
    } catch {
      Toast.show({
        type: "error",
        text1: "Oops, we couldn't open the browser 😿",
      });
    }
  };

  return (
    <View className={"-mt-4 flex h-16 flex-col justify-center gap-1"}>
      <Pressable
        onPress={handlePress}
        style={({ pressed }) => ({
          opacity: pressed ? 0.7 : 1,
        })}
        className={
          "flex flex-1 flex-row items-center justify-between rounded-xl border border-neutral-3-default px-3"
        }
      >
        <View className={"flex flex-row items-center gap-2"}>
          <Icon i={Popcorn} />
          <Text className={"body-b2 text-neutral-6-default"}>
            Currently in cinemas
          </Text>
        </View>
        <View className={"flex flex-row items-center gap-1"}>
          <Text className={"body-b2-strong text-neutral-10-default"}>
            Find tickets
          </Text>
          <Icon i={NavArrowRight} />
        </View>
      </Pressable>
    </View>
  );
};
