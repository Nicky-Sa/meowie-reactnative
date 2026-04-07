import { InnerScreen } from "@/features/common/layout/inner-screen";
import { CollectionsList } from "../../explore/collections/collections-list";
import { useLocalSearchParams } from "expo-router";

export const Screen = () => {
  const { parentId, title } = useLocalSearchParams<{
    parentId: string;
    title: string;
  }>();

  return (
    <InnerScreen title={title}>
      <CollectionsList parentId={parseInt(parentId)} />
    </InnerScreen>
  );
};
