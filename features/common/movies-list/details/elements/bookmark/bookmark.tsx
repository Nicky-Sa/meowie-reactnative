import { Button } from "@/features/common/ui/button";
import { useToggleBookmark } from "@/features/common/movies-list/details/elements/bookmark/data/useToggleBookmark";
import { ID } from "@/features/common/data/query";
import { useCurrentUser } from "@/features/general/data/useCurrentUser";
import { View, Text } from "react-native";
import { useFetchMovieStates } from "@/features/common/movies-list/details/elements/bookmark/data/useFetchMovieStates";
import { useState } from "react";
import { InformationModal } from "@/features/common/information-modal";
import EmptyBookmark from "@/assets/images/profile/empty-bookmark.svg";
import { useRouter } from "expo-router";
import { BookmarkIcon } from "@/features/common/movies-list/details/elements/bookmark/icon";
import { SkeletonItem } from "@/features/common/ui/skeleton-item";

type Props = {
  id: ID;
  onBookmark: () => void;
  onUnbookmark: () => void;
};

export const Bookmark = ({ id, onBookmark, onUnbookmark }: Props) => {
  const { data: currentUser } = useCurrentUser();
  const { data: movieStates, isLoading: isMovieStatesLoading } =
    useFetchMovieStates({ id });
  const { trigger } = useToggleBookmark({ id });
  const isBookmarked = !!movieStates?.bookmarked;

  const router = useRouter();
  const [showLoginModal, setShowLoginModal] = useState(false);

  const onPress = async () => {
    if (!currentUser?.user) {
      setShowLoginModal(true);
      return;
    }

    // Trigger handles the cache update for useFetchMovieStates
    await trigger(isBookmarked);

    if (isBookmarked) {
      onUnbookmark();
    } else {
      onBookmark();
    }
  };

  return (
    <>
      <Button variant={"link"} size={"md"} onPress={onPress}>
        <View className={"flex flex-row items-center justify-center gap-2"}>
          {isMovieStatesLoading ? (
            <SkeletonItem className={"h-6 w-16"} />
          ) : (
            <>
              <BookmarkIcon isBookmarked={isBookmarked} />
              <Text className={"body-b2-strong text-neutral-10-default"}>
                {isBookmarked ? "Saved" : "Save"}
              </Text>
            </>
          )}
        </View>
      </Button>
      <InformationModal
        img={EmptyBookmark}
        informationText={
          "You'll need an account to keep track of movies you want to watch."
        }
        modalVisible={showLoginModal}
        setModalVisible={setShowLoginModal}
      >
        <Button
          onPress={() => {
            router.push("/auth/request-otp");
            setShowLoginModal(false);
          }}
          variant={"white"}
          size={"md"}
          className={"w-full"}
        >
          Login or Sign Up
        </Button>
      </InformationModal>
    </>
  );
};
