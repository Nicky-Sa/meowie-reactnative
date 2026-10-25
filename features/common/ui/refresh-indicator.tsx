import { ActivityIndicator, View } from "react-native";

type Props = {
  top: number;
};

export const RefreshIndicator = ({ top }: Props) => {
  return (
    <View
      pointerEvents={"none"}
      style={{ top }}
      className={"absolute inset-x-0 z-20 items-center py-2"}
    >
      <ActivityIndicator color="white" />
    </View>
  );
};
