import { View, Text } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useAtom } from "jotai";
import { Loading } from "@/features/common/ui/loading";
import { Segment, SegmentItem } from "@/features/common/ui/segment";
import { useFetchJourney } from "@/features/taste/data/use-fetch-journey";
import { QUESTION_ILLUSTRATIONS } from "@/features/taste/steps/questions/illustrations";
import { TasteOption } from "@/features/taste/data/dto/journey.dto";
import { tasteOnboardingAtom } from "@/atoms";

export const Screen = () => {
  const router = useRouter();
  const { order } = useLocalSearchParams<{ order: string }>();
  const index = Number(order) - 1;
  const { data: journey } = useFetchJourney();
  const [state, setState] = useAtom(tasteOnboardingAtom);

  const questions = journey?.questions;
  const question = questions?.[index];

  if (!questions || !question) {
    return <Loading />;
  }

  const current = state.taste[question.id];

  const choose = (value: string) => {
    setState((draft) => {
      draft.taste[question.id] = value;
    });
    if (index < questions.length - 1) {
      router.push({
        pathname: "/taste/questions/[order]",
        params: { order: String(index + 2) },
      });
    } else {
      router.push("/taste/preferences");
    }
  };

  const sideItem = (option: TasteOption): SegmentItem => {
    const SideIllustration = QUESTION_ILLUSTRATIONS[option.id];
    return {
      ...option,
      icon: SideIllustration ? <SideIllustration /> : undefined,
    };
  };

  return (
    <View className={"flex flex-1 flex-col gap-4"}>
      <Text className={"title-t3 text-center text-neutral-10-default"}>
        {question.prompt}
      </Text>
      <View className={"flex flex-1 flex-col gap-3"}>
        <Segment
          item={sideItem(question.sideA)}
          centered
          fill
          currentValues={current ?? ""}
          setCurrentValues={(value) => choose(value as string)}
        />
        <Segment
          item={sideItem(question.sideB)}
          centered
          fill
          currentValues={current ?? ""}
          setCurrentValues={(value) => choose(value as string)}
        />
        <Segment
          item={sideItem(question.both)}
          centered
          currentValues={current ?? ""}
          setCurrentValues={(value) => choose(value as string)}
        />
      </View>
    </View>
  );
};
