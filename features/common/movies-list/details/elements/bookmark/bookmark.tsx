import { Icon } from "@/features/common/ui/icon";
import { Button } from "@/features/common/ui/button";
import { Bookmark as BookmarkIcon } from "iconoir-react-native";
import { useToggleBookmark } from "@/features/common/movies-list/details/elements/bookmark/data/useToggleBookmark";

type Props = {
  id: number;
};

export const Bookmark = ({ id }: Props) => {
  const { trigger, data } = useToggleBookmark({ id });
  return (
    <Button variant={"ghost"} size={"md"} iconOnly onPress={trigger}>
      <Icon i={BookmarkIcon} fill={data?.bookmarked ? "red" : "none"} />
    </Button>
  );
};
