import { Button } from "@/features/common/ui/button";
import { Icon } from "@/features/common/ui/icon";
import { useRouter } from "expo-router";
import { Filter } from "iconoir-react-native";
import { View } from "react-native";
import { Chip } from "@/features/common/ui/chip";

type Props = {
  modifiedFieldsNumber: number;
};

export const FilterIndicator = ({ modifiedFieldsNumber }: Props) => {
  const router = useRouter();
  return (
    <View className={"relative"}>
      <Button
        onPress={() => router.push("/filters")}
        variant={"ghost"}
        size={"md"}
        iconPosition={"only"}
        icon={<Icon i={Filter} />}
      />
      {modifiedFieldsNumber > 0 && (
        <View className={"absolute -left-2"}>
          <Chip text={modifiedFieldsNumber} variant={"primary"} />
        </View>
      )}
    </View>
  );
};
