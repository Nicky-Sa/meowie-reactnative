import { View } from "react-native";
import { PostersList } from "@/features/common/posters/posters-list";
import { useRouter } from "expo-router";
import { useCallback } from "react";
import { useMainScreenContentStyle } from "@/features/common/hooks/useMainScreenContentStyle";
import { TabChildProps } from "@/features/common/tab/tab-bar";
import { useFetchPosters } from "@/features/common/posters/useFetchPosters";
import { SavedEmptyState } from "@/features/profile/logged-in/saved/saved-empty-state";

const NUM_COLUMNS = 3;

type Props = TabChildProps;

export const SavedList = ({ scrollHandler }: Props) => {
  const { paddingBottom } = useMainScreenContentStyle();

  const posterData = useFetchPosters("/library/saved");

  const router = useRouter();
  const onPosterPress = useCallback(
    (index: number) => {
      router.push({
        pathname: "/library/media-list",
        params: {
          initialIndex: index,
          title: "Saved",
        },
      });
    },
    [router, posterData.size],
  );

  return (
    <View className={"flex-1"}>
      <PostersList
        numColumns={NUM_COLUMNS}
        posterData={posterData}
        scrollHandler={scrollHandler}
        onPosterPress={onPosterPress}
        ListEmptyComponent={<SavedEmptyState />}
        contentContainerStyle={{ paddingBottom }}
      />
    </View>
  );
};
