import { Text, View } from "react-native";
import { Button } from "@/features/common/ui/button";
import { useRouter } from "expo-router";

type Props = {
  email: string;
};

export const InfoEmail = ({ email }: Props) => {
  const router = useRouter();
  const handleBack = () => {
    router.back();
  };
  return (
    <>
      <Text className={"body-b2 text-neutral-10-default"}>
        We’ll email you a code to verify your account.
      </Text>
      <View className={"flex flex-row items-center gap-2"}>
        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          className={"body-b2 flex-shrink text-neutral-5-default"}
        >
          {email}
        </Text>
        <Button onPress={handleBack} variant={"link"} size={"sm"}>
          Change
        </Button>
      </View>
    </>
  );
};
