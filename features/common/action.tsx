import * as Haptics from "expo-haptics";
import { Pressable, PressableProps, Text, View } from "react-native";
import { cn, tailwind } from "@/lib/tailwind";
import { PropsWithChildren, useState } from "react";

const actionVariants = {
  black: {
    backgroundColor: [tailwind.theme.backgroundColor.neutral[14].default],
    borderColor: tailwind.theme.borderColor.neutral[3].default,
  },
} as const;

const actionSizes = {
  lg: {
    borderRadius: Number(tailwind.theme.borderRadius.xl),
    paddingVertical: Number(tailwind.theme.spacing["4"]),
    paddingHorizontal: Number(tailwind.theme.spacing["6"]),
    iconOffset: 8,
  },
  md: {
    borderRadius: Number(tailwind.theme.borderRadius.xl),
    paddingVertical: Number(tailwind.theme.spacing["4"]),
    paddingHorizontal: Number(tailwind.theme.spacing["4"]),
    iconOffset: 8,
  },
  sm: {
    borderRadius: Number(tailwind.theme.borderRadius.lg),
    paddingVertical: Number(tailwind.theme.spacing["4"]),
    paddingHorizontal: Number(tailwind.theme.spacing["6"]),
    iconOffset: 8,
  },
} as const;

type Props = PressableProps & {
  variant?: keyof typeof actionVariants;
  size?: keyof typeof actionSizes;
  iconPosition?: "left" | "right";
};

export const Action = ({
  variant = "black",
  size = "lg",
  iconPosition,
  children,
  ...props
}: PropsWithChildren<Props>) => {
  const [focused, setFocused] = useState(false);

  return (
    <View>
      <Pressable
        {...props}
        onPressIn={async (ev) => {
          setFocused(true);
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          props.onPressIn?.(ev);
        }}
        onPressOut={(ev) => {
          setFocused(false);
          props.onPressOut?.(ev);
        }}
      >
        <View
          className={cn("w-full overflow-hidden", focused && "opacity-50")}
          style={{
            backgroundColor: actionVariants[variant].backgroundColor[0],
            borderRadius: actionSizes[size].borderRadius,
            borderWidth: 1,
            borderColor: actionVariants[variant].borderColor,
            paddingVertical: actionSizes[size].paddingVertical,
            paddingRight:
              iconPosition === "right"
                ? actionSizes[size].paddingHorizontal -
                  actionSizes[size].iconOffset
                : actionSizes[size].paddingHorizontal,
            paddingLeft:
              iconPosition === "left"
                ? actionSizes[size].paddingHorizontal -
                  actionSizes[size].iconOffset
                : actionSizes[size].paddingHorizontal,
            ...(props.style as object),
          }}
        >
          {typeof children === "string" ? (
            <Text
              className={cn(
                "body-b1-strong text-center text-neutral-1-default",
                props.className,
              )}
            >
              {children}
            </Text>
          ) : (
            children
          )}
        </View>
      </Pressable>
    </View>
  );
};
