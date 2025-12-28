import { Icon } from "@/features/common/ui/icon";
import { Button } from "@/features/common/ui/button";
import { Bookmark as BookmarkIcon } from "iconoir-react-native";
import { useToggleBookmark } from "@/features/common/movies-list/details/elements/bookmark/data/useToggleBookmark";
import { ID } from "@/features/common/data/query";
import { useCurrentUser } from "@/features/general/data/useCurrentUser";

type Props = {
  id: ID;
};

export const Bookmark = ({ id }: Props) => {
  const currentUser = useCurrentUser();
  const { trigger, data } = useToggleBookmark({ id });
  return (
    <Button variant={"ghost"} size={"md"} iconOnly onPress={trigger}>
      <Icon i={BookmarkIcon} fill={data?.bookmarked ? "red" : "none"} />
    </Button>
  );
};
