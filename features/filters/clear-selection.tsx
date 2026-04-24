import { Button } from "@/features/common/ui/button";
import { Icon } from "@/features/common/ui/icon";
import { Erase } from "iconoir-react-native";

export const ClearSelection = ({ onPress }: { onPress: () => void }) => {
  return (
    <Button
      onPress={onPress}
      variant={"ghost"}
      size={"md"}
      icon={<Icon i={Erase} />}
    >
      Clear
    </Button>
  );
};
