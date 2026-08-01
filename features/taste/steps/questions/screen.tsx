import { View, Text } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useAtom } from "jotai";
import { Loading } from "@/features/common/ui/loading";
import { Segment, SegmentItem } from "@/features/common/ui/segment";
import { useFetchJourney } from "@/features/taste/data/use-fetch-journey";
import { QUESTION_ILLUSTRATIONS } from "@/features/taste/steps/questions/illustrations";
import { Option } from "@/features/common/option";
import { tasteJourneyAtom } from "@/atoms";

export const Screen = () => {
  const router = useRouter();
  const { order } = useLocalSearchParams<{ order: string }>();
  const index = Number(order) - 1;
  const { data: journey } = useFetchJourney();
  const [state, setState] = useAtom(tasteJourneyAtom);

  const questions = journey?.questions;
  const question = questions?.[index];

  if (!questions || !question) {
    return <Loading />;
  }

  const current = state[question.id];

  const choose = (value: string) => {
    setState((draft) => {
      draft[question.id] = value;
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

  const sideItem = (option: Option): SegmentItem => {
    const SideIllustration = QUESTION_ILLUSTRATIONS[option.id];
    return {
      ...option,
      icon: <SideIllustration />,
    };
  };

  return (
    <View className={"mt-8 flex flex-1 flex-col gap-8"}>
      <Text className={"title-t1 text-center text-neutral-8-default"}>
        {question.prompt}
      </Text>
      <View className={"flex flex-1 flex-col gap-3"}>
        {[question.sideA, question.sideB, question.both].map((option) => (
          <Segment
            key={option.id}
            item={sideItem(option)}
            currentValues={current ?? ""}
            setCurrentValues={(value) => choose(value as string)}
          />
        ))}
      </View>
    </View>
  );
};
