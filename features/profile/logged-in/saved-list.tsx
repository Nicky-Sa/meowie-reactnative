import EmptySaved from "@/assets/images/profile/empty-saved.svg";
import { View, Text } from "react-native";
import { PostersList } from "@/features/browse/elements/posters-list";
import { useRouter } from "expo-router";
import { useCallback } from "react";
import { useMainScreenContentStyle } from "@/features/common/hooks/useMainScreenContentStyle";
import { PosterAPIDetails } from "@/features/browse/data/poster/type";
import { TabChildProps } from "@/features/common/tab/tab-bar";

const NUM_COLUMNS = 3;

type Props = TabChildProps;

export const SavedList = ({ scrollHandler }: Props) => {
  const { paddingBottom } = useMainScreenContentStyle();

  const router = useRouter();
  const onPosterPress = useCallback(
    (index: number) => {
      router.push({
        pathname: "/browse/movies-list",
        params: {
          initialIndex: index,
          url: "/movie-states/poster",
          title: "Saved",
          movieState: "saved",
        },
      });
    },
    [router],
  );

  const apiDetails: PosterAPIDetails = {
    url: "/movie-states/poster",
    queryParams: { movieState: "saved" },
  };

  return (
    <View className={"flex-1"}>
      <PostersList
        numColumns={NUM_COLUMNS}
        apiDetails={apiDetails}
        scrollHandler={scrollHandler}
        onPosterPress={onPosterPress}
        ListEmptyComponent={<SavedEmptyState />}
        contentContainerStyle={{ paddingBottom }}
      />
    </View>
  );
};

const SavedEmptyState = () => {
  return (
    <View className={"flex flex-1 flex-col items-center justify-center gap-8"}>
      <EmptySaved />
      <Text className={"body-b1 w-1/2 text-center text-neutral-5-default"}>
        Save movies you want to watch later.
      </Text>
    </View>
  );
};
