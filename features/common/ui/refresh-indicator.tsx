import { View } from "react-native";
import { Loading } from "@/features/common/ui/loading";

type Props = {
  top: number;
};

export const RefreshIndicator = ({ top }: Props) => {
  return (
    <View
      pointerEvents={"none"}
      style={{ top }}
      className={"absolute inset-x-0 z-20 items-center"}
    >
      <View className={"rounded-full bg-neutral-15-default/40 px-3 py-2"}>
        <Loading />
      </View>
    </View>
  );
};
