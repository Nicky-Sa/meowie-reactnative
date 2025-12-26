import { Button } from "@/features/common/button";
import { Icon } from "@/features/common/icon";
import { useRouter } from "expo-router";
import { Filter } from "iconoir-react-native";
import { View } from "react-native";
import { tailwind } from "@/lib/tailwind";
import { Chip } from "@/features/common/chip";

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
        iconOnly
      >
        <Icon i={Filter} />
      </Button>
      {modifiedFieldsNumber > 0 && (
        <View className={"absolute -left-2"}>
          <Chip
            text={modifiedFieldsNumber}
            backgroundColor={tailwind.theme.backgroundColor.brand[1].default}
          />
        </View>
      )}
    </View>
  );
};
