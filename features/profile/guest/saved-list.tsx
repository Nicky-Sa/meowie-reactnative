import EmptySaved from "@/assets/images/meowie/empty-saved.svg";
import { View, Text } from "react-native";
import { Button } from "@/features/common/ui/button";
import { useRouter } from "expo-router";

type Props = {
  headerHeight: number;
};

export const SavedList = ({ headerHeight }: Props) => {
  const router = useRouter();
  return (
    <View
      className={"flex flex-1 flex-col items-center justify-center gap-8"}
      style={{ paddingTop: headerHeight }}
    >
      <EmptySaved />
      <Text className={"body-b1 w-1/2 text-center text-neutral-5-default"}>
        Sign in to start building your watchlist.
      </Text>
      <Button
        variant={"white"}
        size={"md"}
        onPress={() => {
          router.push("/auth");
        }}
      >
        Login or Sign Up
      </Button>
    </View>
  );
};
