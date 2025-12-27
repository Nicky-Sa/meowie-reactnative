import { Text } from "react-native";
import { Image } from "expo-image";
import { Button } from "@/features/common/ui/button";
import { useRouter } from "expo-router";

export const Guest = () => {
  const router = useRouter();
  return (
    <>
      <Image
        source={
          "https://meowie-public.s3.eu-central-1.amazonaws.com/guest-profile.png"
        }
        style={{
          width: 100,
          height: 100,
          borderRadius: 9999,
        }}
        contentFit="cover"
      />
      <Text className={"body-b2 text-neutral-10-default"}>
        You are currently a guest.
      </Text>
      <Text className={"title-t1-strong text-neutral-10-default"}>
        Log in to save your progress.
      </Text>
      <Button
        variant={"white"}
        size={"lg"}
        onPress={() => {
          router.push("/auth/request-otp");
        }}
      >
        Get Started
      </Button>
    </>
  );
};
