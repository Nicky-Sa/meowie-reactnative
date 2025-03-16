import { useRouter } from "expo-router";
import { View, Text, SafeAreaView } from "react-native";
import { Button } from "@/components/common/button";
import ArrowLeft from "@/assets/icons/arrow-left.svg";
import AltArrowRight from "@/assets/icons/alt-arrow-right.svg";

const filters = {
  genre: {
    title: "Genre",
  },
  year: {
    title: "Year (decade)",
  },
  language: {
    title: "Language",
  },
};

export default function Content() {
  const router = useRouter();

  return (
    <View className={"flex-1 bg-neutral-13-default"}>
      <SafeAreaView>
        <View className={"flex h-full flex-col justify-between p-4"}>
          <View
            className={"flex w-full flex-row items-center justify-start gap-3"}
          >
            <Button
              onPress={router.back}
              variant={"secondary"}
              size={"md"}
              square
            >
              <ArrowLeft />
            </Button>
            <Text className={"title-t2-strong text-neutral-10-default"}>
              Filters
            </Text>
          </View>
          <View className={"flex w-full flex-col gap-2"}>
            <Button onPress={router.back} variant={"secondary"} size={"full"}>
              <View
                className={"flex w-full flex-row items-center justify-between"}
              >
                <Text className={"body-b1-strong text-neutral-10-default"}>
                  Genre
                </Text>
                <AltArrowRight />
              </View>
            </Button>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}
