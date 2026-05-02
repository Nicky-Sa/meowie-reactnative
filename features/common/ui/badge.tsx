import { View, Text } from "react-native";
import { cn, tailwind } from "@/lib/tailwind";

const badgeVariants = {
  dirty: {
    backgroundColor: tailwind.theme.backgroundColor["neutral"][11].default,
    textColor: tailwind.theme.textColor["neutral"][6].default,
  },
  dark: {
    backgroundColor: tailwind.theme.backgroundColor["neutral"][12].default,
    textColor: tailwind.theme.textColor["neutral"][6].default,
  },
  primary: {
    backgroundColor: tailwind.theme.backgroundColor["brand"][1].default,
    textColor: tailwind.theme.textColor["neutral"][6].default,
  },
  ghost: {
    backgroundColor: "transparent",
    textColor: tailwind.theme.textColor["neutral"][6].default,
  },
} as const;

const badgeSizes = {
  regular: {
    paddingHorizontal: Number(tailwind.theme.spacing["2"]),
  },
  unset: {
    paddingHorizontal: 0,
  },
} as const;

type Props = {
  text: string | number;
  variant?: keyof typeof badgeVariants;
  size?: keyof typeof badgeSizes;
};

export const Badge = ({ text, variant = "dark", size = "regular" }: Props) => {
  return (
    <View
      className={cn("flex h-6 items-center justify-center rounded-full")}
      style={{
        paddingHorizontal: badgeSizes[size].paddingHorizontal,
        backgroundColor: badgeVariants[variant].backgroundColor,
      }}
    >
      <Text
        className={"body-b2"}
        style={{
          color: badgeVariants[variant].textColor,
        }}
      >
        {text}
      </Text>
    </View>
  );
};
