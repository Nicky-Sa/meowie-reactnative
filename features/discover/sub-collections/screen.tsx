import { InnerScreen } from "@/features/common/layout/inner-screen";
import { CollectionsList } from "../../explore/collections/collections-list";

export const Screen = ({
  parentId,
  title,
}: {
  parentId: string;
  title: string;
}) => {
  return (
    <InnerScreen title={title}>
      <CollectionsList parentId={parseInt(parentId)} />
    </InnerScreen>
  );
};
