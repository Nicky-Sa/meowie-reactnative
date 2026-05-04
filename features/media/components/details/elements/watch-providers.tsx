import { View, Text, Pressable } from "react-native";
import { Image } from "expo-image";
import { NavArrowRight } from "iconoir-react-native";
import { Icon } from "@/features/common/ui/icon";
import { WatchProviders as WatchProvidersType } from "@/features/common/data/models/watch-provider";
import * as WebBrowser from "expo-web-browser";
import * as Haptics from "expo-haptics";
import Toast from "react-native-toast-message";

type Props = {
  providers: WatchProvidersType;
};

export const WatchProviders = ({ providers }: Props) => {
  const allProviders = [
    ...providers.flatrate,
    ...providers.rent,
    ...providers.buy,
  ];

  // Unique by providerId
  const uniqueProviders = Array.from(
    new Map(allProviders.map((p) => [p.providerId, p])).values(),
  ).slice(0, 6);

  if (uniqueProviders.length === 0) return null;

  const handlePress = async () => {
    if (providers.tmdbLink) {
      try {
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
    <View className={"-mt-4 flex flex-col gap-1"}>
      <Pressable
        onPress={handlePress}
        onPressIn={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
        style={({ pressed }) => ({
          opacity: pressed ? 0.7 : 1,
        })}
        className={
          "flex flex-row items-center justify-between rounded-xl border border-neutral-3-default px-3 py-4"
        }
      >
        <View className={"flex flex-row items-center gap-2"}>
          <View className={"flex flex-row items-center"}>
            {uniqueProviders.map((provider, index) => (
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
          <Text className={"body-b2 text-neutral-5-default"}>Watch</Text>
          <Icon i={NavArrowRight} color={"#A3A3A3"} />
        </View>
      </Pressable>
      <Text className={"caption-c1 ml-1 text-neutral-5-default"}>
        Provided by JUSTWATCH
      </Text>
    </View>
  );
};
