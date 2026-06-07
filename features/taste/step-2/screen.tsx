import { InnerScreen } from "@/features/common/layout/inner-screen";
import { Text, View } from "react-native";
import { Button } from "@/features/common/ui/button";
import { useRouter } from "expo-router";
import { Slider } from "@/features/common/ui/slider";
import { Animation } from "@/features/taste/step-2/elements/animation";
import { useAtom } from "jotai";
import { tasteFlexibilityAtom } from "@/atoms";

export const Screen = () => {
  const router = useRouter();
  const [currentValues, setCurrentValues] = useAtom(tasteFlexibilityAtom);

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
          <Animation progress={parseInt(currentValues[0]) / 100} />
          <View className="flex w-full flex-col">
            <Slider
              currentValues={currentValues}
              setCurrentValues={setCurrentValues}
              min={0}
              max={100}
              debounceDelay={0}
              labels={["Strict", "Flexible"]}
            />
          </View>
        </View>
        <Button
          variant={"white"}
          size={"lg"}
          onPress={() => {
            router.push("/taste/finalizing");
          }}
        >
          Next
        </Button>
      </View>
    </InnerScreen>
  );
};
