import * as Haptics from "expo-haptics";
import { Pressable, PressableProps, Text, View } from "react-native";
import { cn, tailwind } from "@/lib/tailwind";
import { PropsWithChildren, ReactNode, useState } from "react";
import { Loading } from "@/features/common/ui/loading";

const buttonVariants = {
  primary: {
    backgroundColor: tailwind.theme.backgroundColor.info[1].default,
    borderColor: tailwind.theme.borderColor.brand[1].default,
    textColor: tailwind.theme.textColor.neutral[10].default,
    borderWidth: 1,
  },
  white: {
    backgroundColor: tailwind.theme.backgroundColor.neutral[1].default,
    borderColor: tailwind.theme.borderColor.neutral[7].default,
    textColor: tailwind.theme.textColor.neutral[1].default,
    borderWidth: 1,
  },
  black: {
    backgroundColor: tailwind.theme.backgroundColor.neutral[14].default,
    borderColor: tailwind.theme.borderColor.neutral[3].default,
    textColor: tailwind.theme.textColor.neutral[10].default,
    borderWidth: 1,
  },
  ghost: {
    backgroundColor: "transparent",
    borderColor: "transparent",
    textColor: tailwind.theme.textColor.neutral[10].default,
    borderWidth: 0,
  },
  // for links, with no padding, no text direction
  link: {
    backgroundColor: "transparent",
    borderColor: "transparent",
    textColor: tailwind.theme.textColor.neutral[10].default,
    borderWidth: 0,
  },
  // for segments in selectable
  "unselected-segment": {
    backgroundColor: tailwind.theme.backgroundColor.neutral[15].default,
    borderColor: tailwind.theme.borderColor.neutral[3].default,
    textColor: tailwind.theme.textColor.neutral[10].default,
    borderWidth: 2,
  },
  "selected-segment": {
    backgroundColor: tailwind.theme.backgroundColor.neutral[14].default,
    borderColor: tailwind.theme.borderColor.brand[1].default,
    textColor: tailwind.theme.textColor.neutral[10].default,
    borderWidth: 2,
  },
} as const;

const buttonSizes = {
  segment: {
    borderRadius: Number(tailwind.theme.borderRadius.xl),
    paddingVertical: Number(tailwind.theme.spacing["4"]),
    paddingHorizontal: Number(tailwind.theme.spacing["4"]),
    iconOffset: 4,
  },
  lg: {
    borderRadius: Number(tailwind.theme.borderRadius.xl),
    paddingVertical: Number(tailwind.theme.spacing["4"]),
    paddingHorizontal: Number(tailwind.theme.spacing["6"]),
    iconOffset: 8,
  },
  md: {
    borderRadius: Number(tailwind.theme.borderRadius.xl),
    paddingVertical: Number(tailwind.theme.spacing["3"]),
    paddingHorizontal: Number(tailwind.theme.spacing["4"]),
    iconOffset: 4,
  },
  sm: {
    borderRadius: Number(tailwind.theme.borderRadius.lg),
    paddingVertical: Number(tailwind.theme.spacing["2"]),
    paddingHorizontal: Number(tailwind.theme.spacing["3"]),
    iconOffset: 4,
  },
  unset: {
    borderRadius: 0,
    paddingVertical: 0,
    paddingHorizontal: 0,
    iconOffset: 0,
  },
};

type Props = PressableProps & {
  variant?: keyof typeof buttonVariants;
  size?: keyof typeof buttonSizes;
  haptic?: boolean;
  iconPosition?: "left" | "right" | "only";
  isLoading?: boolean;
  icon?: ReactNode;
};

export const Button = ({
  variant = "primary",
  size = "lg",
  haptic = true,
  isLoading,
  icon,
  iconPosition = "left",
  children,
  ...props
}: PropsWithChildren<Props>) => {
  const [focused, setFocused] = useState(false);
  const textOnly = typeof children === "string" && !!children;
  const iconOnly = iconPosition === "only";

  return (
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
        if (haptic) {
          void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        props.onPress?.(ev);
      }}
      disabled={props.disabled || isLoading}
    >
      <View
        className={cn("overflow-hidden")}
        style={{
          opacity: props.disabled ? 0.5 : focused ? 0.7 : 1,
          backgroundColor: buttonVariants[variant].backgroundColor,
          borderRadius: variant !== "link" ? buttonSizes[size].borderRadius : 0,
          borderWidth: buttonVariants[variant].borderWidth,
          borderColor: buttonVariants[variant].borderColor,
          paddingVertical:
            variant !== "link" ? buttonSizes[size].paddingVertical : 0,
          paddingHorizontal:
            variant !== "link"
              ? iconOnly
                ? buttonSizes[size].paddingVertical
                : buttonSizes[size].paddingHorizontal
              : 0,
          ...(props.style as object),
        }}
      >
        {isLoading ? (
          <View className={cn(props.className)}>
            <Loading />
          </View>
        ) : (
          <View
            className={cn(
              "flex-row items-center",
              (textOnly || !!icon) &&
                variant !== "link" &&
                "h-6 justify-center", // for absolute bare text
              props.className,
            )}
            style={textOnly ? { gap: buttonSizes[size].iconOffset } : undefined}
          >
            {(iconPosition === "left" || iconPosition === "only") && icon}
            {!iconOnly &&
              (textOnly ? (
                <Text
                  style={{
                    color: buttonVariants[variant].textColor,
                  }}
                  className={cn({
                    "text-center": variant !== "link",
                    "body-b1-strong": size === "lg",
                    "body-b2-strong": size === "md",
                    "caption-c1-strong": size === "sm",
                  })}
                >
                  {children}
                </Text>
              ) : (
                children
              ))}
            {iconPosition === "right" && icon}
          </View>
        )}
      </View>
    </Pressable>
  );
};
