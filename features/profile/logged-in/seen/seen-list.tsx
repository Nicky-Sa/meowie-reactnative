import { View } from "react-native";
import { PostersList } from "@/features/common/posters/posters-list";
import { useRouter } from "expo-router";
import { useCallback } from "react";
import { useMainScreenContentStyle } from "@/features/common/hooks/useMainScreenContentStyle";
import { TabChildProps } from "@/features/common/tab/tab-bar";
import { useFetchPosters } from "@/features/common/posters/useFetchPosters";
import { SeenEmptyState } from "@/features/profile/logged-in/seen/seen-empty-state";

const NUM_COLUMNS = 3;

type Props = TabChildProps;

export const SeenList = ({ scrollHandler }: Props) => {
  const { paddingBottom } = useMainScreenContentStyle();

  const posterData = useFetchPosters("/library/seen");

  const router = useRouter();
  const onPosterPress = useCallback(
    (index: number) => {
      router.push({
        pathname: "/library/media-list",
        params: {
          initialIndex: index,
          category: "seen",
          title: "Seen",
        },
      });
    },
    [router],
  );

  return (
    <View className={"flex-1"}>
      <PostersList
        numColumns={NUM_COLUMNS}
        posterData={posterData}
        scrollHandler={scrollHandler}
        onPosterPress={onPosterPress}
        ListEmptyComponent={<SeenEmptyState />}
        contentContainerStyle={{ paddingBottom }}
      />
    </View>
  );
};
