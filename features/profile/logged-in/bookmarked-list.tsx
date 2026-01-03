import EmptyBookmark from "@/assets/images/profile/empty-bookmark.svg";
import { View, Text } from "react-native";
import { PostersList } from "@/features/browse/elements/posters-list";
import { useScrollHandler } from "@/features/browse/hooks/list/useScrollHandler";
import { useRouter } from "expo-router";
import { useCallback } from "react";
import { useMainScreenContentStyle } from "@/features/common/hooks/useMainScreenContentStyle";

const NUM_COLUMNS = 3;

const EmptyState = () => {
  return (
    <View className={"flex flex-1 flex-col items-center justify-center gap-8"}>
      <EmptyBookmark />
      <Text className={"body-b1 w-1/2 text-center text-neutral-5-default"}>
        Save movies you want to watch later.
      </Text>
    </View>
  );
};

export const BookmarkedList = () => {
  const { scrollHandler } = useScrollHandler();
  const { paddingBottom } = useMainScreenContentStyle();

  const router = useRouter();
  const onPosterPress = useCallback(
    (index: number) => {
      router.push({
        pathname: "/browse/movies-list",
        params: {
          initialIndex: index,
        },
      });
    },
    [router],
  );
  return (
    <View className={"flex-1"}>
      <PostersList
        numColumns={NUM_COLUMNS}
        searchParams={{ personId: "65731" }}
        scrollHandler={scrollHandler}
        onPosterPress={onPosterPress}
        ListEmptyComponent={<EmptyState />}
        contentContainerStyle={{ paddingBottom }}
      />
    </View>
  );
};
