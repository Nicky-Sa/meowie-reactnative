import { View, Text } from "react-native";
import { cn, tailwind } from "@/lib/tailwind";

const chipVariants = {
  dirty: {
    backgroundColor: tailwind.theme.backgroundColor["neutral"][11].default,
    textColor: tailwind.theme.textColor["neutral"][6].default,
  },
  dark: {
    backgroundColor: tailwind.theme.backgroundColor["neutral"][12].default,
    textColor: tailwind.theme.textColor["neutral"][6].default,
  },
  ghost: {
    backgroundColor: "transparent",
    textColor: tailwind.theme.textColor["neutral"][6].default,
  },
} as const;

type Props = {
  text: string | number;
  variant?: keyof typeof chipVariants;
};

export const Chip = ({ text, variant = "dark" }: Props) => {
  return (
    <View
      className={cn("flex h-6 items-center justify-center rounded-full px-2")}
      style={{
        backgroundColor: chipVariants[variant].backgroundColor,
      }}
    >
      <Text
        className={"body-b2-strong"}
        style={{
          color: chipVariants[variant].textColor,
        }}
      >
        {text}
      </Text>
    </View>
  );
};
