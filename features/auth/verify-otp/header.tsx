import { Text, View } from "react-native";
import { Button } from "@/features/common/ui/button";
import { Icon } from "@/features/common/ui/icon";
import { NavArrowLeft } from "iconoir-react-native";

type Props = {
  handleBack: () => void;
};

export const Header = ({ handleBack }: Props) => {
  return (
    <View className={"flex flex-row items-center"}>
      <Button onPress={handleBack} variant={"ghost"} size={"md"} iconOnly>
        <Icon i={NavArrowLeft} />
      </Button>
      <Text className={"title-t2 text-neutral-10-default"}>
        Verification code
      </Text>
    </View>
  );
};
