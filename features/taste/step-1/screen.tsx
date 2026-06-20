import { InnerScreen } from "@/features/common/layout/inner-screen";
import { Button } from "@/features/common/ui/button";
import { Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { TasteItem } from "@/features/taste/step-1/elements/taste-item";
import { Divider } from "@/features/common/ui/divider";
import { tasteKeywordsAtom, tasteFlexibilityAtom } from "@/atoms";
import { useAtom } from "jotai";
import { useIsTransitionFinished } from "@/hooks/use-is-transition-finished";
import { Skeletons } from "@/features/taste/step-1/elements/skeletons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SkipTaste } from "@/features/taste/step-1/elements/skip-taste";
import { useFetchTaste } from "@/features/taste/data/use-fetch-taste";
import { useTasteItems } from "@/features/taste/step-1/data/use-taste-items";
import { useEffect, useRef } from "react";
import { ErrorState } from "@/features/general/error-state";

export const Screen = () => {
  const isTransitionFinished = useIsTransitionFinished();
  const router = useRouter();
  const { from } = useLocalSearchParams<{ from?: string }>();
  const fromOnboarding = from === "onboarding";
  const [taste, setTaste] = useAtom(tasteKeywordsAtom);
  const [, setFlexibility] = useAtom(tasteFlexibilityAtom);
  const { data: savedTaste } = useFetchTaste();
  const {
    data: tasteItems,
    isLoading: isTasteItemsLoading,
    isError: isTasteItemsError,
    refetch: refetchTasteItems,
  } = useTasteItems();
  const hasHydrated = useRef(false);

  // Preload saved taste data from the backend (only once)
  useEffect(() => {
    if (savedTaste && !hasHydrated.current) {
      hasHydrated.current = true;
      setTaste(savedTaste.keywords);
      setFlexibility(savedTaste.flexibility);
    }
  }, [savedTaste, setTaste, setFlexibility]);

  const selectedCount = taste.length;
  const isLoading = !isTransitionFinished || isTasteItemsLoading;

  return (
    <InnerScreen
      title={"Share your taste"}
      subtitle={"You can change these later."}
      fullWidth
      rightTopComponent={fromOnboarding && <SkipTaste />}
    >
      {isTasteItemsError || !tasteItems ? (
        <ErrorState
          error={"We couldn't load the taste options. Please try again."}
          tryAgain={refetchTasteItems}
        />
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerClassName={"flex flex-col gap-2"}
        >
          {isLoading ? (
            <Skeletons />
          ) : (
            tasteItems.map((genre, i) => {
              return (
                <View key={genre.id} className={"flex flex-col"}>
                  <TasteItem
                    name={genre.name}
                    emoji={genre.emoji}
                    keywords={genre.keywords}
                    taste={taste}
                    setTaste={setTaste}
                  />
                  {i < tasteItems.length - 1 && <Divider />}
                </View>
              );
            })
          )}
        </ScrollView>
      )}

      {/* Fixed footer */}
      <View className={"flex flex-col justify-center gap-4 px-4 pt-3"}>
        <Text className={"body-b2 text-center text-neutral-5-default"}>
          {selectedCount} {selectedCount === 1 ? "item is" : "items are"}{" "}
          selected
        </Text>
        <Button
          variant={"white"}
          size={"lg"}
          disabled={selectedCount === 0 || isLoading}
          onPress={() => {
            router.push("/taste/step-2");
          }}
        >
          Next
        </Button>
      </View>
    </InnerScreen>
  );
};
