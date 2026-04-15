import { View, Text } from "react-native";
import { cn, tailwind } from "@/lib/tailwind";

const chipVariants = {
  dark: {
    backgroundColor: tailwind.theme.backgroundColor["neutral"][11].default,
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

const chipSizes = {
  regular: {
    paddingHorizontal: Number(tailwind.theme.spacing["2"]),
  },
  unset: {
    paddingHorizontal: 0,
  },
} as const;

type Props = {
  text: string | number;
  variant?: keyof typeof chipVariants;
  size?: keyof typeof chipSizes;
  clickable?: boolean;
};

export const Chip = ({
  text,
  variant = "dark",
  size = "regular",
  clickable,
}: Props) => {
  return (
    <View
      className={cn("flex h-6 items-center justify-center rounded-full")}
      style={{
        paddingHorizontal: chipSizes[size].paddingHorizontal,
        backgroundColor: chipVariants[variant].backgroundColor,
      }}
    >
      <Text
        className={clickable ? "body-b2-strong" : "body-b2"}
        style={{
          color: chipVariants[variant].textColor,
        }}
      >
        {text}
      </Text>
    </View>
  );
};
