import { View, Text, Pressable } from "react-native";
import { Image } from "expo-image";
import { PosterInfo } from "@/features/common/data/models/poster";
import Animated, {
  FadeIn,
  FadeOut,
  ZoomIn,
  ZoomOut,
} from "react-native-reanimated";
import { Chip } from "@/features/common/ui/chip";

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
        className="w-[85%] rounded-3xl bg-neutral-15-default p-4 shadow-2xl"
      >
        <Image
          source={data.posterPath}
          style={{
            width: "100%",
            aspectRatio: 2 / 3,
          }}
          contentFit="cover"
          placeholder={{ blurhash: data.blurhash }}
        />
        <View className="gap-2">
          <View className="flex-row items-center justify-between">
            <Text
              className="title-t1-strong flex-1 text-neutral-10-default"
              numberOfLines={1}
            >
              {data.preview.title}
            </Text>
          </View>
          <View className="flex-row flex-wrap gap-3">
            {data.preview.genres.map((genre) => (
              <Chip
                key={genre.id}
                text={`${genre.emoji} ${genre.name}`}
                variant={"ghost"}
                size={"unset"}
                clickable
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
