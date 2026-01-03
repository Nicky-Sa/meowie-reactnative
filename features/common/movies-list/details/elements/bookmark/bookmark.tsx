import { Button } from "@/features/common/ui/button";
import { useToggleBookmark } from "@/features/common/movies-list/details/elements/bookmark/data/useToggleBookmark";
import { ID } from "@/features/common/data/query";
import { useCurrentUser } from "@/features/general/data/useCurrentUser";
import { View, Text } from "react-native";
import { useFetchMovieStates } from "@/features/common/movies-list/details/elements/bookmark/data/useFetchMovieStates";
import { useRef, useState } from "react";
import { InformationModal } from "@/features/common/information-modal";
import EmptyBookmark from "@/assets/images/profile/empty-bookmark.svg";
import { useRouter } from "expo-router";
import {
  BookmarkIcon,
  BookmarkIconHandle,
} from "@/features/common/movies-list/details/elements/bookmark/icon";

type Props = {
  id: ID;
};

export const Bookmark = ({ id }: Props) => {
  const { data: currentUser } = useCurrentUser();
  const { data: movieStates } = useFetchMovieStates({ id });
  const { trigger } = useToggleBookmark({ id });
  const isBookmarked = !!movieStates?.bookmarked;

  const router = useRouter();
  const [showLoginModal, setShowLoginModal] = useState(false);

  const bookmarkIconRef = useRef<BookmarkIconHandle>(null);

  const onPress = async () => {
    if (!currentUser?.user) {
      setShowLoginModal(true);
      return;
    }
    if (isBookmarked) {
      bookmarkIconRef.current?.unbookmark();
    } else {
      bookmarkIconRef.current?.bookmark();
    }
    // Trigger handles the cache update for useFetchMovieStates
    await trigger(isBookmarked);
  };
  return (
    <>
      <Button variant={"link"} size={"md"} onPress={onPress}>
        <View className={"flex flex-row items-center justify-center gap-2"}>
          <BookmarkIcon ref={bookmarkIconRef} isBookmarked={isBookmarked} />
          <Text className={"body-b2-strong text-neutral-10-default"}>
            {isBookmarked ? "Saved" : "Save"}
          </Text>
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
