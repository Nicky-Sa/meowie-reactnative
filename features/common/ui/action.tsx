import * as Haptics from "expo-haptics";
import { Pressable, PressableProps, Text, View } from "react-native";
import { cn, tailwind } from "@/lib/tailwind";
import { PropsWithChildren, ReactNode, useState } from "react";

const actionVariants = {
  black: {
    backgroundColor: [tailwind.theme.backgroundColor.neutral[14].default],
    borderColor: tailwind.theme.borderColor.neutral[3].default,
    textColor: tailwind.theme.textColor.neutral[10].default,
  },
  promoted: {
    backgroundColor: [tailwind.theme.backgroundColor.brand[1].default],
    borderColor: tailwind.theme.borderColor.neutral[3].default,
    textColor: tailwind.theme.textColor.neutral[10].default,
  },
} as const;

const actionSizes = {
  lg: {
    borderRadius: Number(tailwind.theme.borderRadius.xl),
    paddingVertical: Number(tailwind.theme.spacing["4"]),
    paddingHorizontal: Number(tailwind.theme.spacing["6"]),
  },
  md: {
    borderRadius: Number(tailwind.theme.borderRadius.xl),
    paddingVertical: Number(tailwind.theme.spacing["4"]),
    paddingHorizontal: Number(tailwind.theme.spacing["4"]),
  },
  sm: {
    borderRadius: Number(tailwind.theme.borderRadius.lg),
    paddingVertical: Number(tailwind.theme.spacing["4"]),
    paddingHorizontal: Number(tailwind.theme.spacing["6"]),
  },
} as const;

type Props = PressableProps & {
  variant?: keyof typeof actionVariants;
  size?: keyof typeof actionSizes;
  icon?: ReactNode;
};

export const Action = ({
  variant = "black",
  size = "lg",
  icon,
  children,
  ...props
}: PropsWithChildren<Props>) => {
  const [focused, setFocused] = useState(false);
  const isTextOnly = typeof children === "string" && !!children;

  return (
    <View>
      <Pressable
        {...props}
        onPressIn={(ev) => {
          setFocused(true);
          props.onPressIn?.(ev);
        }}
        onPressOut={(ev) => {
          setFocused(false);
          props.onPressOut?.(ev);
        }}
        onPress={(ev) => {
          void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          props.onPress?.(ev);
        }}
      >
        <View
          className={cn("w-full overflow-hidden")}
          style={{
            opacity: props.disabled ? 0.5 : focused ? 0.7 : 1,
            backgroundColor: actionVariants[variant].backgroundColor[0],
            borderRadius: actionSizes[size].borderRadius,
            borderWidth: 1,
            borderColor: actionVariants[variant].borderColor,
            paddingVertical: actionSizes[size].paddingVertical,
            paddingHorizontal: actionSizes[size].paddingHorizontal,
            ...(props.style as object),
          }}
        >
          <View
            className={cn(
              "flex-row items-center justify-between",
              props.className,
            )}
          >
            {isTextOnly ? (
              <Text
                style={{ color: actionVariants[variant].textColor }}
                className={cn("body-b1-strong")}
              >
                {children}
              </Text>
            ) : (
              children
            )}
            {icon}
          </View>
        </View>
      </Pressable>
    </View>
  );
};
