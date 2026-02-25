import { Button } from "@/features/common/ui/button";
import { View, Text } from "react-native";
import { Icon } from "@/features/common/ui/icon";
import { Erase } from "iconoir-react-native";

export const ClearSelection = ({ onPress }: { onPress: () => void }) => {
  return (
    <Button
      onPress={onPress}
      variant={"ghost"}
      size={"md"}
      iconPosition={"left"}
    >
      <View className={"flex flex-row items-center justify-center gap-2"}>
        <Icon i={Erase} />

        <Text className={"body-b1-strong text-neutral-10-default"}>Clear</Text>
      </View>
    </Button>
  );
};
