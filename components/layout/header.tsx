import { Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Rive, { Alignment, Fit } from "rive-react-native";
import Filter from "@/assets/icons/filter.svg";
import Bento from "@/components/common/bento"

export const Header = () => {
  const insets = useSafeAreaInsets();

  return (
    <View
      className={
        "absolute z-10 flex w-full flex-1 flex-row items-start justify-between px-4"
      }
      style={{
        marginTop: insets.top,
        height: insets.top + 28,
      }}
    >
      <View className={"w-[144px] -mt-1"}>
        <Rive
          url="https://meowie-public.s3.eu-central-1.amazonaws.com/Meowie-logo.riv"
          alignment={Alignment.TopLeft}
        />
      </View>
      <Pressable>
        <Bento>
          <Filter />
        </Bento>
      </Pressable>
    </View>
  );
};
