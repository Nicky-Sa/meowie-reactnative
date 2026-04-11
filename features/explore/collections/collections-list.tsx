import { useFetchCollections } from "./useFetchCollections";
import { CollectionCard } from "./collection-card";
import { memo } from "react";
import { CollectionListSkeleton } from "@/features/explore/collections/collection-list-skeleton";
import { ScrollView } from "react-native-gesture-handler";

type Props = {
  parentId?: number;
};

export const CollectionsList = memo(({ parentId }: Props) => {
  const { data, isLoading, isError } = useFetchCollections(parentId);

  const collectionsData = data?.data;

  if (isLoading) {
    return <CollectionListSkeleton />;
  }

  // no error state for now
  if (isError || !collectionsData) {
    return;
  }

  if (collectionsData.length === 0) {
    return;
  }

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerClassName={"flex flex-col gap-4 pb-20"}
    >
      {collectionsData.map((item) => (
        <CollectionCard key={item.id} collection={item} />
      ))}
    </ScrollView>
  );
});

CollectionsList.displayName = "CollectionsList";
