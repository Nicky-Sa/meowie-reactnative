import { Button } from "@/features/common/ui/button";
import { useMarkAsSeen } from "@/features/media/components/details/elements/seen/data/useMarkAsSeen";
import { useRemoveSeen } from "@/features/media/components/details/elements/seen/data/useRemoveSeen";
import { useUpdateRating } from "@/features/media/components/details/elements/seen/data/useUpdateRating";
import { ID } from "@/features/common/data/media-query";
import { useCurrentUser } from "@/features/general/data/useCurrentUser";
import { View, Text } from "react-native";
import { useFetchLibraryStatus } from "@/features/media/components/details/elements/save/data/useFetchLibraryStatus";
import { useRef, useState } from "react";
import { InformationModal } from "@/features/common/information-modal";
import EmptySeen from "@/assets/images/profile/empty-seen.svg";
import { useRouter } from "expo-router";
import { SeenIcon } from "@/features/media/components/details/elements/seen/icon";
import { SkeletonItem } from "@/features/common/ui/skeleton-item";
import { MediaType } from "@/features/common/data/models/media-type";
import {
  BottomSheet,
  ExposedBottomSheetModalRef,
} from "@/features/common/ui/bottom-sheet";
import { RATINGS } from "@/features/media/components/details/elements/seen/rating-icons";
import { cn } from "@/lib/tailwind";
import { Icon } from "@/features/common/ui/icon";
import RatingSkip from "@/assets/images/ratings/rating-skip.svg";

type Props = {
  id: ID;
  mediaType: MediaType;
  onPress: (seen: boolean | null) => void;
};

export const Seen = ({ id, mediaType, onPress }: Props) => {
  const { data: currentUser } = useCurrentUser();
  const { data: libraryStatus, isLoading: isLibraryStatusLoading } =
    useFetchLibraryStatus({ id, mediaType });
  const { markAsSeen } = useMarkAsSeen({ id, mediaType });
  const { removeSeen } = useRemoveSeen({ id, mediaType });
  const { updateRating } = useUpdateRating({ id, mediaType });
  const isSeen = Boolean(libraryStatus?.seen);
  const isSaved = Boolean(libraryStatus?.saved);
  const currentRating = libraryStatus?.rating;
  const showSaveWarning = !isSeen && isSaved;

  const router = useRouter();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const bottomSheetRef = useRef<ExposedBottomSheetModalRef>(null);

  const handlePress = async () => {
    if (!currentUser?.user) {
      onPress(null);
      setShowLoginModal(true);
      return;
    }

    // Always open the bottom sheet — for both initial and update flows
    bottomSheetRef.current?.present();
    onPress(!isSeen);
  };

  const handleRate = async (rating: number | null) => {
    bottomSheetRef.current?.dismiss();
    if (isSeen) {
      await updateRating(rating ?? undefined);
    } else {
      await markAsSeen(rating ?? undefined);
    }
  };

  const handleUnseen = async () => {
    bottomSheetRef.current?.dismiss();
    await removeSeen();
    onPress(false);
  };

  return (
    <>
      <Button
        variant={"link"}
        size={"md"}
        onPress={handlePress}
        style={{ overflow: "visible" }}
      >
        <View className={"flex flex-row items-center justify-center gap-2"}>
          {isLibraryStatusLoading ? (
            <SkeletonItem className={"h-6 w-16"} />
          ) : (
            <>
              <SeenIcon isSeen={isSeen} rating={currentRating} />
              <Text className={"body-b2-strong text-neutral-10-default"}>
                Seen
              </Text>
            </>
          )}
        </View>
      </Button>

      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={[showSaveWarning ? "40%" : "35%"]}
        index={0}
        title={isSeen ? "Update Rating" : `Rate this ${mediaType}`}
        enableDynamicSizing={false}
        footer={
          isSeen ? (
            // Already seen: let the user remove it
            <Button variant={"ghost"} size={"lg"} onPress={handleUnseen}>
              {`Remove this ${mediaType} from seen list`}
            </Button>
          ) : (
            // First time: let the user skip rating
            <Button
              variant={"ghost"}
              size={"lg"}
              onPress={() => handleRate(null)}
            >
              <View
                className={"flex flex-row items-center justify-center gap-2"}
              >
                <Icon i={RatingSkip} />
                <Text className={"body-b1-strong text-neutral-10-default"}>
                  Skip rating
                </Text>
              </View>
            </Button>
          )
        }
      >
        <View className="flex flex-col gap-6">
          {showSaveWarning && (
            <Text className="body-b2 text-neutral-10-default opacity-60">
              This action will remove the item from your saved list and add it
              to your watched history.
            </Text>
          )}
          <View className="flex flex-row items-center justify-center gap-2">
            {RATINGS.map(({ value, icon }) => {
              const isSelected = currentRating === value;
              return (
                <Button
                  key={value}
                  variant={"ghost"}
                  size={"unset"}
                  onPress={() => handleRate(value)}
                >
                  <View
                    className={cn(
                      "flex flex-col items-center gap-2 rounded-xl border border-neutral-3-default p-2",
                      isSelected && "bg-brand-1-default",
                    )}
                  >
                    <Icon i={icon} width={48} height={48} />
                    <Text className="body-b2 text-neutral-10-default">
                      {value}
                    </Text>
                  </View>
                </Button>
              );
            })}
          </View>
        </View>
      </BottomSheet>

      <InformationModal
        img={EmptySeen}
        informationText={"You'll need an account to track what you've seen."}
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
