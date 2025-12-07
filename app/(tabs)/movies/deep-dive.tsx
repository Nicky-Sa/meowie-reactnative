import { Content } from "@/features/movies/deep-dive/content";
import { useLocalSearchParams } from "expo-router";

export default function DeepDive() {
  const { personId, personName } = useLocalSearchParams<{
    personId: string;
    personName: string;
  }>();
  return <Content personId={Number(personId)} personName={personName} />;
}
