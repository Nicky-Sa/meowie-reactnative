import { Button } from "@/features/common/ui/button";
import { Icon } from "@/features/common/ui/icon";
import { DataTransferBoth } from "iconoir-react-native";
import { View } from "react-native";
import {
  BottomSheet,
  ExposedBottomSheetModalRef,
} from "@/features/common/ui/bottom-sheet";
import { useRef } from "react";
import { Segment } from "@/features/common/ui/segment";
import { useImmer } from "use-immer";
import { useLocalSearchParams, useRouter } from "expo-router";
import { initialSort, SortOption } from "@/features/common/data/media-query";
import { useCaptureEvent } from "@/features/general/posthog/hook/use-capture-event";

const sortOptions: { id: SortOption; label: string; description: string }[] = [
  {
    id: SortOption.POPULARITY,
    label: "Popularity (default)",
    description:
      "Shows the movies that are currently being watched the most or have the highest ratings.",
  },
  {
    id: SortOption.RELEASE_DATE,
    label: "Newest",
    description: "Shows the most recently added or released movies.",
  },
  {
    id: SortOption.RANDOM,
    label: "Random",
    description: "Shows a completely unpredictable mix of good movies.",
  },
];

export const SortHeaderButton = () => {
  const { sort } = useLocalSearchParams<{ sort?: SortOption }>();
  const [draftSort, setDraftSort] = useImmer(sort || initialSort);
  const isModified = !!sort && sort !== initialSort;
  const bottomSheetRef = useRef<ExposedBottomSheetModalRef>(null);
  const router = useRouter();
  const { capture } = useCaptureEvent();

  return (
    <>
      <Button
        onPress={() => {
          bottomSheetRef.current?.present();
          capture("sort_opened");
        }}
        variant={"ghost"}
        size={"md"}
        iconOnly
      >
        <Icon i={DataTransferBoth} />
      </Button>
      {isModified && (
        <View
          className={
            "absolute left-1 top-1 h-2 w-2 rounded-full bg-brand-1-default"
          }
        />
      )}
      <BottomSheet
        ref={bottomSheetRef}
        title={"Sort options"}
        index={1}
        footer={
          <Button
            variant="white"
            size="lg"
            onPress={() => {
              capture("sort_applied", { sort_type: draftSort });
              router.replace({
                pathname: "/movies",
                params: { sort: draftSort },
              });
              bottomSheetRef.current?.dismiss();
            }}
          >
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
