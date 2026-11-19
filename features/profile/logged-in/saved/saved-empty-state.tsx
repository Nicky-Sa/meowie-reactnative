import EmptySaved from "@/assets/images/meowie/empty-saved.svg";
import { EmptyState } from "@/features/general/empty-state";

export const SavedEmptyState = () => {
  return (
    <EmptyState img={EmptySaved} text={"You haven't saved anything yet."} />
  );
};
