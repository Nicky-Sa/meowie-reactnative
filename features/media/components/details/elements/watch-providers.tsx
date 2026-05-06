import { View, Text, Pressable } from "react-native";
import { Image } from "expo-image";
import { NavArrowRight } from "iconoir-react-native";
import { Icon } from "@/features/common/ui/icon";
import {
  WatchProvider,
  WatchProviders as WatchProvidersType,
} from "@/features/common/data/models/watch-provider";
import * as WebBrowser from "expo-web-browser";
import * as Haptics from "expo-haptics";
import Toast from "react-native-toast-message";
import CryingMeowie from "@/assets/images/profile/crying-meowie.svg";
import { ID } from "@/features/common/data/media-query";
import { MediaType } from "@/features/common/data/models/media-type";
import { useAnalytics } from "@/features/general/posthog/hook/use-analytics";

type Props = {
  providers: WatchProvidersType;
  mediaId: ID;
  mediaType: MediaType;
};

export const WatchProviders = ({ providers, mediaId, mediaType }: Props) => {
  const { media } = useAnalytics();
  const allProviders = [
    ...providers.flatrate,
    ...providers.rent,
    ...providers.buy,
  ];

  // Unique by providerId
  const uniqueProviders = Array.from(
    new Map(allProviders.map((p) => [p.providerId, p])).values(),
  ).slice(0, 6);

  const handlePress = async () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (providers.tmdbLink) {
      try {
        media.trackWatchProvidersClicked({ mediaId, mediaType });
        await WebBrowser.openBrowserAsync(providers.tmdbLink, {
          presentationStyle: WebBrowser.WebBrowserPresentationStyle.PAGE_SHEET,
        });
      } catch {
        Toast.show({
          type: "error",
          text1: "Oops, we couldn't open the browser 😿",
        });
      }
    }
  };

  return (
    <View className={"-mt-4 flex h-[85px] flex-col justify-center gap-1"}>
      <Pressable
        onPress={handlePress}
        style={({ pressed }) => ({
          opacity: pressed ? 0.7 : 1,
        })}
        className={
          "flex flex-1 flex-row items-center justify-between rounded-xl border border-neutral-3-default px-3"
        }
      >
        {uniqueProviders.length > 0 ? (
          <WithContent providers={uniqueProviders} />
        ) : (
          <NoContent />
        )}
      </Pressable>
      <Text className={"caption-c1 ml-1 text-neutral-5-default"}>
        Provided by JUSTWATCH
      </Text>
    </View>
  );
};

const NoContent = () => (
  <>
    <View className={"flex flex-row items-center gap-3"}>
      <Icon i={CryingMeowie} />
      <Text className={"body-b2 text-neutral-6-default"}>
        No platforms in your region.
      </Text>
    </View>
    <View className={"flex flex-row items-center gap-1"}>
      <Text className={"body-b2 font-semibold text-neutral-10-default"}>
        See others
      </Text>
      <Icon i={NavArrowRight} />
    </View>
  </>
);

const WithContent = ({ providers }: { providers: WatchProvider[] }) => (
  <>
    <View className={"flex flex-row items-center gap-2"}>
      <View className={"flex flex-row items-center"}>
        {providers.map((provider, index) => (
          <View
            key={provider.providerId}
            className={
              "h-8 w-8 overflow-hidden rounded-full border border-neutral-1-default"
            }
            style={{ marginLeft: index === 0 ? 0 : -8 }}
          >
            <Image
              source={provider.logoPath}
              style={{ width: "100%", height: "100%" }}
              contentFit="cover"
            />
          </View>
        ))}
      </View>
    </View>
    <View className={"flex flex-row items-center gap-1"}>
      <Text className={"body-b2 text-neutral-10-default"}>Watch</Text>
      <Icon i={NavArrowRight} />
    </View>
  </>
);
