import { Screen } from "@/features/person/media-list/screen";
import { useLocalSearchParams } from "expo-router";

export default function PersonMediaListScreen() {
  const { id, title, initialIndex } = useLocalSearchParams<{
    id: string;
    title: string;
    initialIndex: string;
  }>();
  return <Screen personId={id} title={title} initialIndex={initialIndex} />;
}
