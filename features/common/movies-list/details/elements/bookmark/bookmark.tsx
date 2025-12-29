import { Icon } from "@/features/common/ui/icon";
import { Button } from "@/features/common/ui/button";
import { Bookmark as BookmarkIcon } from "iconoir-react-native";
import { useToggleBookmark } from "@/features/common/movies-list/details/elements/bookmark/data/useToggleBookmark";
import { ID } from "@/features/common/data/query";
import { useCurrentUser } from "@/features/general/data/useCurrentUser";
import { tailwind } from "@/lib/tailwind";
import { View, Text } from "react-native";
import { useFetchMovieStates } from "@/features/common/movies-list/details/elements/bookmark/data/useFetchMovieStates";

type Props = {
  id: ID;
};

export const Bookmark = ({ id }: Props) => {
  const { data: currentUser } = useCurrentUser();
  const { data: movieStates } = useFetchMovieStates({ id });
  const { trigger } = useToggleBookmark({ id });

  const isBookmarked = !!movieStates?.bookmarked;

  const onPress = async () => {
    // TODO: modal to login
    if (!currentUser?.user) return;

    // Trigger now handles the cache update for useFetchMovieStates
    await trigger(isBookmarked);
  };
  return (
    <Button variant={"ghost"} size={"md"} iconOnly onPress={onPress}>
      <View className={"flex flex-row items-center justify-center gap-2"}>
        <Icon
          i={BookmarkIcon}
          fill={
            isBookmarked
              ? tailwind.theme.backgroundColor.neutral[1].default
              : "none"
          }
        />
        <Text className={"body-b2-strong text-neutral-10-default"}>
          {isBookmarked ? "Saved" : "Save"}
        </Text>
      </View>
    </Button>
  );
};
