import { Screen } from "@/features/discover/sub-collections/screen";
import { useLocalSearchParams } from "expo-router";

export default function SubCollectionsPage() {
  const { id, title } = useLocalSearchParams<{ id: string; title: string }>();
  return <Screen parentId={id} title={title} />;
}
