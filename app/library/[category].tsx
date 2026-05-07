import { Screen } from "@/features/library/media-list/screen";
import { useLocalSearchParams } from "expo-router";
import { LibraryCategory } from "@/features/profile/data/library.constants";

export default function LibraryMediaListScreen() {
  const { category, title, initialIndex } = useLocalSearchParams<{
    category: LibraryCategory;
    title: string;
    initialIndex: string;
  }>();
  return (
    <Screen category={category} title={title} initialIndex={initialIndex} />
  );
}
