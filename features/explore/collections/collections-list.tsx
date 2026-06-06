import { useFetchCollections } from "./use-fetch-collections";
import { CollectionCard } from "./collection-card";
import { memo, useCallback } from "react";
import { CollectionListSkeleton } from "@/features/explore/collections/collection-list-skeleton";
import { FlashList } from "@shopify/flash-list";
import { View } from "react-native";
import { CollectionResDto } from "@/features/explore/collections/collection.dto";

type Props = {
  parentId?: number;
};

export const CollectionsList = memo(({ parentId }: Props) => {
  const { data, isLoading } = useFetchCollections(parentId);

  const renderItem = useCallback(({ item }: { item: CollectionResDto }) => {
    return <CollectionCard collection={item} />;
  }, []);

  return (
    <View className={"flex flex-1"}>
      <FlashList
        data={data}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        contentContainerClassName={"grow"}
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View className="h-4" />}
        ListEmptyComponent={isLoading ? <CollectionListSkeleton /> : null}
      />
    </View>
  );
});

CollectionsList.displayName = "CollectionsList";
