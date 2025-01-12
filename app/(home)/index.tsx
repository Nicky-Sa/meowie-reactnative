import { GradientBg } from "@/components/ui/random-gradient-bg";
import { useFetchColor } from "@/hooks/useFetchColor";
import { View, Text } from "react-native";

export default function HomeScreen() {
  const color = useFetchColor(
    "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcQkUywIUXDjHSQJIaNHYVs08osgBpF5Ot-xmB_omyEZeeRP9Xug",
  );
  return (
    <GradientBg colors={[`${color}80`, `${color}80`]}>
      <View
        className={`flex flex-col gap-2 items-start justify-between h-full`}
      >
        <Text className={"text-white"}>Home</Text>
      </View>
    </GradientBg>
  );
}
