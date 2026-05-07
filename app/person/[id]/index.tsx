import { Screen } from "@/features/person/screen";
import { useLocalSearchParams } from "expo-router";

export default function PersonScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <Screen personId={id} />;
}
