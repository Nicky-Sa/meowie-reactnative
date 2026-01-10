import { Button } from "@/features/common/ui/button";
import { useToggleSave } from "@/features/common/movies-list/details/elements/save/data/useToggleSave";
import { ID } from "@/features/common/data/query";
import { useCurrentUser } from "@/features/general/data/useCurrentUser";
import { View, Text } from "react-native";
import { useFetchMovieStates } from "@/features/common/movies-list/details/elements/save/data/useFetchMovieStates";
import { useState } from "react";
import { InformationModal } from "@/features/common/information-modal";
import EmptySaved from "@/assets/images/profile/empty-saved.svg";
import { useRouter } from "expo-router";
import { SaveIcon } from "@/features/common/movies-list/details/elements/save/icon";
import { SkeletonItem } from "@/features/common/ui/skeleton-item";

type Props = {
  id: ID;
  onPress: (saved: boolean | null) => void;
};

export const Save = ({ id, onPress }: Props) => {
  const { data: currentUser } = useCurrentUser();
  const { data: movieStates, isLoading: isMovieStatesLoading } =
    useFetchMovieStates({ id });
  const { trigger } = useToggleSave({ id });
  const isSaved = !!movieStates?.saved;

  const router = useRouter();
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handlePress = async () => {
    onPress(!currentUser?.user ? null : !isSaved);

    if (!currentUser?.user) {
      setShowLoginModal(true);
      return;
    }

    // Trigger handles the cache update for useFetchMovieStates
    await trigger(isSaved);
  };

  return (
    <>
      <Button variant={"link"} size={"md"} onPress={handlePress}>
        <View className={"flex flex-row items-center justify-center gap-2"}>
          {isMovieStatesLoading ? (
            <SkeletonItem className={"h-6 w-16"} />
          ) : (
            <>
              <SaveIcon isSaved={isSaved} />
              <Text className={"body-b2-strong text-neutral-10-default"}>
                {isSaved ? "Saved" : "Save"}
              </Text>
            </>
          )}
        </View>
      </Button>
      <InformationModal
        img={EmptySaved}
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
