import { useEffect, useRef } from "react";
import { View, Text } from "react-native";
import { RenderProps } from "react-native-spotlight-tour";
import { Button } from "@/features/common/ui/button";
import { NavArrowLeft } from "iconoir-react-native";
import { Icon } from "@/features/common/ui/icon";
import { useAnalytics } from "@/features/general/posthog/events/use-analytics";

type Props = RenderProps & {
  text: string;
  stepName: string;
  total: number;
};

export const TourTooltip = ({
  current,
  isFirst,
  isLast,
  next,
  previous,
  stop,
  text,
  stepName,
  total,
}: Props) => {
  const { tour } = useAnalytics();
  const lastViewedStep = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (lastViewedStep.current === current) return;

    lastViewedStep.current = current;

    tour.trackStepViewed({ step: current + 1, stepName });
  }, [current, stepName, tour]);

  const handleSkip = () => {
    tour.trackSkipped({ step: current + 1, stepName });
    stop();
  };

  const handleBack = () => {
    tour.trackBackTapped({ step: current + 1, stepName });
    previous();
  };

  const handleContinue = () => {
    if (isLast) {
      tour.trackCompleted({ totalSteps: total });
      stop();
      return;
    }

    tour.trackNextTapped({ step: current + 1, stepName });
    next();
  };

  return (
    <View className="w-[250px] gap-4 rounded-2xl bg-neutral-15-default p-4">
      {/* Header */}
      <View className="flex-row items-center justify-between">
        <Text className="body-b1 text-neutral-5-default">
          {current + 1} / {total}
        </Text>
        <Button onPress={handleSkip} variant={"link"} size={"md"}>
          Skip
        </Button>
      </View>

      {/* Content */}
      <View>
        <Text className="body-b1 text-neutral-10-default">{text}</Text>
      </View>

      {/* Footer */}
      <View className="flex-row items-center justify-between">
        <View className="flex-row gap-2">
          {!isFirst ? (
            <Button
              onPress={handleBack}
              variant={"black"}
              iconPosition={"only"}
              size={"md"}
              icon={<Icon i={NavArrowLeft} />}
            />
          ) : (
            <View />
          )}
        </View>

        <Button onPress={handleContinue} variant={"primary"} size={"md"}>
          {isLast ? "Let's Go!" : "Next step"}
        </Button>
      </View>
    </View>
  );
};
