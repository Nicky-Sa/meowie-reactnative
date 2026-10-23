import { View } from "react-native";
import { PostersList } from "@/features/common/posters/posters-list";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback } from "react";
import { useMainScreenContentStyle } from "@/features/common/hooks/use-main-screen-content-style";
import { TabChildProps } from "@/features/common/tab/tab-bar";
import { useFetchPosters } from "@/features/common/posters/use-fetch-posters";
import { SavedEmptyState } from "@/features/profile/logged-in/saved/saved-empty-state";
import { useInvalidateByPattern } from "@/features/common/data/query/hooks";
import { tailwind } from "@/lib/tailwind";

const NUM_COLUMNS = 3;

type Props = TabChildProps;

export const SavedList = ({ scrollHandler }: Props) => {
  const { paddingBottom } = useMainScreenContentStyle();
  const { invalidateByPattern } = useInvalidateByPattern();

  const posterData = useFetchPosters("/library/saved");

  // Refetch when coming back to this screen
  useFocusEffect(
    useCallback(() => {
      void invalidateByPattern(/\/library\/saved.*/);
    }, [invalidateByPattern]),
  );

  const router = useRouter();
  const onPosterPress = useCallback(
    (index: number) => {
      router.push({
        pathname: "/library/[category]",
        params: {
          category: "saved",
          initialIndex: index.toString(),
          title: "Saved",
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
        ListEmptyComponent={<SavedEmptyState />}
        contentContainerStyle={{
          paddingTop: Number(tailwind.theme.spacing["2"]),
          paddingBottom,
        }}
      />
    </View>
  );
};
