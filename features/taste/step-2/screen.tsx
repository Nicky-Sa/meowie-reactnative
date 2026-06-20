import { InnerScreen } from "@/features/common/layout/inner-screen";
import { Text, View } from "react-native";
import { Button } from "@/features/common/ui/button";
import { useRouter } from "expo-router";
// import { Animation } from "@/features/taste/step-2/elements/animation";
import { useAtom } from "jotai";
import { tasteFlexibilityAtom } from "@/atoms";
import { Segment } from "@/features/common/ui/segment";
import { useFlexibilityOptions } from "@/features/taste/step-2/data/use-flexibility-options";
import { SkeletonItem } from "@/features/common/ui/skeleton-item";
import { ErrorState } from "@/features/general/error-state";

export const Screen = () => {
  const router = useRouter();
  const [flexibility, setFlexibility] = useAtom(tasteFlexibilityAtom);
  const {
    data: flexibilityOptions,
    isLoading: isFlexibilityOptionsLoading,
    isError: isFlexibilityOptionsError,
    refetch: refetchFlexibilityOptions,
  } = useFlexibilityOptions();

  return (
    <InnerScreen
      title={"How flexible are you?"}
      subtitle={"Are you open to a little mix & match?"}
    >
      <View className="flex-1 flex-col gap-4">
        <View className={"my-14 flex flex-1 flex-col gap-2"}>
          <View className={"flex flex-col gap-2"}>
            <Text
              className={"title-t3-strong text-center text-neutral-10-default"}
            >
              We can recommend a wider range of content
            </Text>
            <Text className={"body-b2 text-center text-neutral-5-default"}>
              if you choose a higher flexibility.
            </Text>
          </View>
          {/*<Animation progress={parseInt(currentValues[0]) / 100} />*/}
          {isFlexibilityOptionsLoading ? (
            <View className="flex w-full flex-row justify-center gap-2">
              <SkeletonItem className={"h-12 w-24"} />
              <SkeletonItem className={"h-12 w-24"} />
              <SkeletonItem className={"h-12 w-24"} />
            </View>
          ) : isFlexibilityOptionsError || !flexibilityOptions ? (
            <ErrorState
              error={"We couldn't load the flexibility options."}
              tryAgain={refetchFlexibilityOptions}
            />
          ) : (
            <View className="flex w-full flex-row justify-center gap-2">
              {flexibilityOptions.map((option) => (
                <Segment
                  key={option.id}
                  item={option}
                  currentValues={flexibility}
                  setCurrentValues={setFlexibility}
                />
              ))}
            </View>
          )}
        </View>
        <Button
          variant={"white"}
          size={"lg"}
          disabled={!flexibility}
          onPress={() => {
            router.replace("/taste/finalizing");
          }}
        >
          Next
        </Button>
      </View>
    </InnerScreen>
  );
};
