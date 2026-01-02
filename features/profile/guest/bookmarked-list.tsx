import EmptyBookmark from "@/assets/images/empty-bookmark.svg";
import { View, Text } from "react-native";
import { Button } from "@/features/common/ui/button";
import { useRouter } from "expo-router";

export const BookmarkedList = () => {
  const router = useRouter();
  return (
    <View className={"flex flex-1 flex-col items-center justify-center gap-8"}>
      <EmptyBookmark />
      <Text className={"body-b1 text-center text-neutral-5-default"}>
        Sign in to start building your watchlist.
      </Text>
      <Button
        variant={"white"}
        size={"md"}
        onPress={() => {
          router.push("/auth/request-otp");
        }}
      >
        Login or Sign Up
      </Button>
    </View>
  );
};
