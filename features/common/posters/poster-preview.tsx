import { View, Text, Pressable } from "react-native";
import { Image } from "expo-image";
import { PosterInfo } from "@/features/common/data/models/poster";
import Animated, {
  FadeIn,
  FadeOut,
  ZoomIn,
  ZoomOut,
} from "react-native-reanimated";
import { tailwind } from "@/lib/tailwind";
import { capitalize } from "@/lib/functions";
import { Badge } from "@/features/common/ui/badge";

type Props = {
  data: PosterInfo;
};

export const PosterPreview = ({ data }: Props) => {
  return (
    <Animated.View
      entering={FadeIn.duration(200)}
      exiting={FadeOut.duration(200)}
      className="absolute inset-0 z-[9999] items-center justify-center"
      pointerEvents="auto"
    >
      {/* Background Dim - use Pressable to intercept and disable touches */}
      <Pressable
        className="absolute inset-0 bg-neutral-10-default/50"
        pointerEvents={"none"}
      />

      {/* Preview Card */}
      <Animated.View
        entering={ZoomIn.delay(100)}
        exiting={ZoomOut}
        className="w-[85%] gap-4 rounded-3xl bg-neutral-15-default p-4 shadow-2xl"
      >
        <View className={"relative"}>
          <Image
            source={data.posterPath}
            style={{
              width: "100%",
              aspectRatio: 2 / 3,
              borderRadius: Number(tailwind.theme.borderRadius.xl),
            }}
            contentFit="cover"
            placeholder={{ blurhash: data.blurhash }}
          />
          <View className="absolute bottom-2 left-2">
            <Badge text={capitalize(data.mediaType)} variant="dirty" />
          </View>
        </View>
        <View className="gap-2">
          <View className="flex-row items-center justify-between">
            <Text
              className="title-t1-strong flex-1 text-neutral-10-default"
              numberOfLines={1}
            >
              {data.preview.title}
            </Text>
          </View>
          <View className="flex-row flex-wrap gap-x-3 gap-y-1">
            {data.preview.genres.map((genre) => (
              <Badge
                key={genre.id}
                text={`${genre.emoji} ${genre.name}`}
                variant={"ghost"}
                size={"unset"}
              />
            ))}
          </View>
          <Text className="body-b2 text-neutral-6-default" numberOfLines={3}>
            {data.preview.overview}
          </Text>
        </View>
      </Animated.View>
    </Animated.View>
  );
};
