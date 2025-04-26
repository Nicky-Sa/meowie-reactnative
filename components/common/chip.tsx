import { View, Text } from "react-native";
import { tailwind } from "@/lib/utils";

type Props = {
  text: string | number;
  backgroundColor?: string;
  textColor?: string;
};

const Chip = ({ text, backgroundColor, textColor }: Props) => {
  return (
    <View
      className={"rounded-full px-2.5 py-1"}
      style={{
        backgroundColor:
          backgroundColor ??
          tailwind.theme.backgroundColor["neutral"][11].default,
      }}
    >
      <Text
        className={"body-b2"}
        style={{
          color: textColor ?? tailwind.theme.textColor["neutral"][6].default,
        }}
      >
        {text}
      </Text>
    </View>
  );
};
export default Chip;
