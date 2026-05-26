import { Text, View } from "react-native";
import { Button } from "@/features/common/ui/button";
import { useRouter } from "expo-router";
import { Edit } from "iconoir-react-native";
import { Icon } from "@/features/common/ui/icon";

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
        Enter the received code to your email.
      </Text>
      <View className={"flex flex-row items-center gap-2"}>
        <Button
          onPress={handleBack}
          variant={"link"}
          icon={<Icon i={Edit} width={20} height={20} />}
          iconPosition={"right"}
        >
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            className={"body-b2 mr-2 flex-shrink text-neutral-5-default"}
          >
            {email}
          </Text>
        </Button>
      </View>
    </>
  );
};
