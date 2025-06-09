import * as Haptics from "expo-haptics";
import { Pressable, PressableProps, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { cn } from "@/lib/utils";
import { buttonVariants, buttonSizes } from "@/lib/consts";
import { PropsWithChildren, useState } from "react";

type Props = PressableProps & {
  variant?: keyof typeof buttonVariants;
  size?: keyof typeof buttonSizes;
  square?: boolean;
  haptic?: boolean;
  iconPosition?: "left" | "right";
};

export const Button = ({
  variant = "primary",
  size = "lg",
  square = false,
  haptic = true,
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
          if (haptic) {
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }
          props.onPressIn?.(ev);
        }}
        onPressOut={(ev) => {
          setFocused(false);
          props.onPressOut?.(ev);
        }}
      >
        <View
          className={cn(
            "overflow-hidden",
            focused && "opacity-50",
            size === "full" && "w-full",
          )}
        >
          <LinearGradient
            colors={buttonVariants[variant].backgroundColor}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{
              borderRadius: buttonSizes[size].borderRadius,
              borderWidth: 1,
              borderColor: buttonVariants[variant].borderColor,
              paddingVertical: buttonSizes[size].paddingVertical,
              paddingRight: square
                ? buttonSizes[size].paddingVertical
                : iconPosition === "right"
                  ? buttonSizes[size].paddingRight -
                    buttonSizes[size].iconOffset
                  : buttonSizes[size].paddingRight,
              paddingLeft: square
                ? buttonSizes[size].paddingVertical
                : iconPosition === "left"
                  ? buttonSizes[size].paddingLeft - buttonSizes[size].iconOffset
                  : buttonSizes[size].paddingLeft,
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
          </LinearGradient>
        </View>
      </Pressable>
    </View>
  );
};
