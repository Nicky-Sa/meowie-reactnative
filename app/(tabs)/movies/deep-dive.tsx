import { Content } from "@/features/movies/deep-dive/content";
import { useLocalSearchParams } from "expo-router";

export default function DeepDive() {
  const { personId } = useLocalSearchParams<{ personId: string }>();
  return <Content personId={Number(personId)} />;
}
