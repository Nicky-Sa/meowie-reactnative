import { InnerScreen } from "@/features/common/layout/inner-screen";
import { Button } from "@/features/common/ui/button";
import { Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { TASTE_GENRES } from "./genre-data";
import { TasteItem } from "@/features/taste/step-1/elements/taste-item";
import { Divider } from "@/features/common/ui/divider";
import { tasteKeywordsAtom } from "@/atoms";
import { useAtom } from "jotai";
import { useIsTransitionFinished } from "@/hooks/use-is-transition-finished";
import { Skeletons } from "@/features/taste/step-1/elements/skeletons";
import { useRouter } from "expo-router";
import { Skip } from "@/features/taste/step-1/elements/skip";

export const Screen = () => {
  const isTransitionFinished = useIsTransitionFinished();
  const router = useRouter();
  const [taste, setTaste] = useAtom(tasteKeywordsAtom);

  const selectedCount = taste.length;

  return (
    <InnerScreen
      title={"Share your taste"}
      subtitle={"You can change these later."}
      fullWidth
      rightTopComponent={<Skip />}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName={"flex flex-col gap-2"}
      >
        {isTransitionFinished ? (
          TASTE_GENRES.map((genre, i) => {
            return (
              <View key={genre.id} className={"flex flex-col"}>
                <TasteItem
                  name={genre.name}
                  emoji={genre.emoji}
                  keywords={genre.keywords}
                  taste={taste}
                  setTaste={setTaste}
                />
                {i < TASTE_GENRES.length - 1 && <Divider />}
              </View>
            );
          })
        ) : (
          <Skeletons />
        )}
      </ScrollView>

      {/* Fixed footer */}
      <View className={"flex flex-col justify-center gap-4 px-4 pt-3"}>
        <Text className={"body-b2 text-center text-neutral-5-default"}>
          {selectedCount} {selectedCount === 1 ? "item is" : "items are"}{" "}
          selected
        </Text>
        <Button
          variant={"white"}
          size={"lg"}
          disabled={selectedCount === 0}
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
