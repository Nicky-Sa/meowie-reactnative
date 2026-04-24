import { View, Text } from "react-native";
import { TooltipProps } from "rn-tourguide";
import { Button } from "@/features/common/ui/button";
import { NavArrowLeft } from "iconoir-react-native";
import { Icon } from "@/features/common/ui/icon";
import { TourStep } from "./steps";

const TOTAL_STEPS = Object.values(TourStep).filter(
  (v) => typeof v === "number",
).length;

export const TourTooltip = ({
  isFirstStep,
  isLastStep,
  handleNext,
  handlePrev,
  handleStop,
  currentStep,
}: TooltipProps) => {
  return (
    <View className="w-[250px] -translate-y-4 translate-x-4 gap-4 rounded-2xl bg-neutral-15-default p-4">
      {/* Header */}
      <View className="flex-row items-center justify-between">
        <Text className="body-b1 text-neutral-5-default">
          {currentStep?.order} / {TOTAL_STEPS}
        </Text>
        <Button onPress={handleStop} variant={"link"} size={"md"}>
          Skip
        </Button>
      </View>

      {/* Content */}
      <View>
        <Text className="body-b1 text-neutral-10-default">
          {currentStep?.text}
        </Text>
      </View>

      {/* Footer */}
      <View className="flex-row items-center justify-between">
        <View className="flex-row gap-2">
          {!isFirstStep ? (
            <Button
              onPress={handlePrev}
              variant={"black"}
              iconPosition={"only"}
              size={"md"}
              icon={<Icon i={NavArrowLeft} />}
            />
          ) : (
            <View />
          )}
        </View>

        <Button
          onPress={isLastStep ? handleStop : handleNext}
          variant={"primary"}
          size={"md"}
        >
          {isLastStep ? "Let's Go!" : "Next Step"}
        </Button>
      </View>
    </View>
  );
};
