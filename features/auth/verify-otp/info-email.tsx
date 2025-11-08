import { Text, View } from "react-native";
import { Button } from "@/features/common/button";

type Props = {
  email: string;
  handleBack: () => void;
};

export const InfoEmail = ({ email, handleBack }: Props) => {
  return (
    <>
      <Text className={"body-b2 text-neutral-10-default"}>
        We’ll email you a code for verification your account.
      </Text>
      <View className={"flex flex-row items-center gap-2"}>
        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          className={"body-b2 flex-shrink text-neutral-5-default"}
        >
          {email}
        </Text>
        <Button
          onPress={handleBack}
          variant={"ghost"}
          size={"unset"}
          className={"caption-c1-strong"}
        >
          Change
        </Button>
      </View>
    </>
  );
};
