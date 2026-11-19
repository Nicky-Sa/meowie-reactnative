import EmptySeen from "@/assets/images/meowie/empty-seen.svg";
import { EmptyState } from "@/features/general/empty-state";

export const SeenEmptyState = () => {
  return (
    <EmptyState
      img={EmptySeen}
      text={"You haven't marked anything as seen yet."}
    />
  );
};
