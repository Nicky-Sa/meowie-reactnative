import { ComponentType } from "react";
import { MediaListScreen } from "@/features/media/components/list/media-list-screen";
import { useFetchPosters } from "@/features/common/posters/use-fetch-posters";
import { SavedEmptyState } from "@/features/profile/logged-in/saved/saved-empty-state";
import { SeenEmptyState } from "@/features/profile/logged-in/seen/seen-empty-state";
import { LibraryCategory } from "@/features/profile/data/library.constants";

const EMPTY_STATES: Record<LibraryCategory, ComponentType> = {
  saved: SavedEmptyState,
  seen: SeenEmptyState,
};

export const Screen = ({
  title,
  category,
  initialIndex,
}: {
  title: string;
  category: LibraryCategory;
  initialIndex?: string;
}) => {
  const posterData = useFetchPosters(`/library/${category}`);
  const CategoryEmptyState = EMPTY_STATES[category];

  return (
    <MediaListScreen
      title={title}
      posterData={posterData}
      initialIndex={initialIndex ? Number(initialIndex) : undefined}
      ListEmptyComponent={<CategoryEmptyState />}
    />
  );
};
