import { Button } from "@/features/common/button";
import { Icon } from "@/features/common/icon";
import { DataTransferBoth } from "iconoir-react-native";
import { View } from "react-native";
import {
  BottomSheet,
  ExposedBottomSheetModalRef,
} from "@/features/common/bottom-sheet";
import { useRef } from "react";
import { Segment } from "@/features/common/segment";
import { useImmer } from "use-immer";
import { useLocalSearchParams, useRouter } from "expo-router";
import { initialSort, Sort } from "@/features/common/data/query";

const sortOptions: { id: Sort; label: string; description: string }[] = [
  {
    id: "popularity.desc",
    label: "Popularity (default)",
    description:
      "Shows the movies that are currently being watched the most or have the highest ratings.",
  },
  {
    id: "primary_release_date.desc",
    label: "Newest",
    description: "Shows the most recently added or released movies.",
  },
  {
    id: "random",
    label: "Random",
    description: "Shows a completely unpredictable mix of good movies.",
  },
];

export const SortHeaderButton = () => {
  const { sort } = useLocalSearchParams<{ sort?: Sort }>();
  const [draftSort, setDraftSort] = useImmer(sort || initialSort);
  const isModified = !!sort && sort !== initialSort;
  const bottomSheetRef = useRef<ExposedBottomSheetModalRef>(null);
  const router = useRouter();

  return (
    <>
      <Button
        onPress={() => bottomSheetRef.current?.present()}
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
              setCurrentValues={(val) => setDraftSort(val as Sort)}
              multiple={false}
            />
          ))}
        </View>
      </BottomSheet>
    </>
  );
};
