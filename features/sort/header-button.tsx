import { Button } from "@/features/common/ui/button";
import { Icon } from "@/features/common/ui/icon";
import { DataTransferBoth } from "iconoir-react-native";
import { View } from "react-native";
import {
  BottomSheet,
  ExposedBottomSheetModalRef,
} from "@/features/common/ui/bottom-sheet";
import { useCallback, useRef } from "react";
import { Segment } from "@/features/common/ui/segment";
import { useImmer } from "use-immer";
import { SortOption } from "@/features/common/data/media-query";
import { useAnalytics } from "@/features/general/posthog/hook/use-analytics";
import { useAtom } from "jotai";
import { sortAtom } from "@/atoms";

const sortOptions: { id: SortOption; label: string; description: string }[] = [
  {
    id: SortOption.POPULARITY,
    label: "Popularity",
    description:
      "Shows the movies and series that are currently being watched the most or have the highest ratings.",
  },
  {
    id: SortOption.NEWEST,
    label: "Newest",
    description: "Shows the most recently added or released movies and series.",
  },
  {
    id: SortOption.RANDOM,
    label: "Random",
    description:
      "Shows a completely unpredictable mix of good movies and series.",
  },
];

export const SortHeaderButton = () => {
  const [sort, setSort] = useAtom(sortAtom);
  const [draftSort, setDraftSort] = useImmer(sort);
  const bottomSheetRef = useRef<ExposedBottomSheetModalRef>(null);
  const { discovery } = useAnalytics();

  const applySort = useCallback(() => {
    discovery.trackSortApplied({ sortType: draftSort });
    setSort(draftSort);
    bottomSheetRef.current?.dismiss();
  }, [discovery, draftSort, setSort]);

  const sortBottomsheetOpened = useCallback(() => {
    discovery.trackSortOpened();
    setDraftSort(sort);
    bottomSheetRef.current?.present();
  }, [discovery, setDraftSort, sort]);

  return (
    <>
      <Button
        onPress={sortBottomsheetOpened}
        variant={"ghost"}
        size={"md"}
        iconPosition={"only"}
        icon={<Icon i={DataTransferBoth} />}
      />
      <BottomSheet
        ref={bottomSheetRef}
        title={"Sort options"}
        enableDynamicSizing
        footer={
          <Button variant="white" size="lg" onPress={applySort}>
            Apply
          </Button>
        }
      >
        <View className={"flex w-full flex-col gap-2"}>
          {sortOptions.map((option) => (
            <Segment
              key={option.id}
              item={option}
              currentValues={draftSort}
              setCurrentValues={(val) => setDraftSort(val as SortOption)}
              multiple={false}
            />
          ))}
        </View>
      </BottomSheet>
    </>
  );
};
