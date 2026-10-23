import { View } from "react-native";
import { SharedValue, useAnimatedReaction } from "react-native-reanimated";
import { MediaType } from "@/features/common/data/models/media-type";
import { useScrollHandler } from "@/features/common/hooks/list/use-scroll-handler";
import { useMainScreenContentStyle } from "@/features/common/hooks/use-main-screen-content-style";
import { CollectionsList } from "@/features/explore/collections/collections-list";
import { ExploreTabResDto } from "@/features/explore/data/dto/explore-tab.dto";
import { ExplorePosters } from "@/features/explore/posters";
import { COLLECTIONS_TAB } from "@/features/explore/tab-bar";
import { tailwind } from "@/lib/tailwind";

type Props = {
  mediaType: MediaType;
  tab: ExploreTabResDto | null;
  headerHeight: number;
  scrollPositions: SharedValue<Record<string, number>>;
};

export const TabContent = ({
  mediaType,
  tab,
  headerHeight,
  scrollPositions,
}: Props) => {
  const { scrollHandler, scrollY, isDragging } = useScrollHandler();
  const { paddingBottom } = useMainScreenContentStyle();
  const tabName = `${mediaType}-${tab?.slug ?? COLLECTIONS_TAB}`;

  useAnimatedReaction(
    () => scrollY.value,
    (current) => {
      scrollPositions.value = {
        ...scrollPositions.value,
        [tabName]: current,
      };
    },
  );

  return tab ? (
    <ExplorePosters
      mediaType={mediaType}
      tab={tab}
      scrollHandler={scrollHandler}
      scrollY={scrollY}
      isDragging={isDragging}
      headerHeight={headerHeight}
    />
  ) : (
    <View className="flex-1 px-4">
      <CollectionsList
        mediaType={mediaType}
        scrollHandler={scrollHandler}
        contentInsetAdjustmentBehavior="never"
        contentContainerStyle={{
          paddingTop: headerHeight + Number(tailwind.theme.spacing["2"]),
          paddingBottom,
        }}
      />
    </View>
  );
};
