import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Rive, { Alignment } from "rive-react-native";

export const Header = () => {
  const insets = useSafeAreaInsets();

  return (
    <View
      className={"absolute z-10 w-full flex-1 items-start px-4"}
      style={{
        marginTop: insets.top,
        height: insets.top + 32,
      }}
    >
      <Rive
        url="https://meowie-public.s3.eu-central-1.amazonaws.com/Meowie-logo.riv"
        style={{
          width: "40%",
          height: "100%",
        }}
        alignment={Alignment.CenterLeft}
      />
    </View>
  );
};
