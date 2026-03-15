import { View, TextInput as RNTextInput, Text } from "react-native";
import {
  Controller,
  FieldError,
  FieldValues,
  UseControllerProps,
  UseFormClearErrors,
} from "react-hook-form";
import { TextInputProps } from "react-native/Libraries/Components/TextInput/TextInput";
import { cn, tailwind } from "@/lib/tailwind";
import { Icon, SvgImage } from "@/features/common/ui/icon";
import { InfoCircle, Xmark } from "iconoir-react-native";
import { Button } from "@/features/common/ui/button";
import { useEffect, useRef, useState } from "react";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolateColor,
} from "react-native-reanimated";

// ... (Keep textInputStates and textInputSizes exactly as they were) ...
const textInputStates = {
  default: {
    backgroundColor: tailwind.theme.backgroundColor.neutral[15].default,
    borderColor: tailwind.theme.borderColor.neutral[4].default,
    textColor: tailwind.theme.textColor.neutral[10].default,
  },
  focus: {
    backgroundColor: tailwind.theme.backgroundColor.neutral[15].default,
    borderColor: tailwind.theme.borderColor.neutral[10].default,
    textColor: tailwind.theme.textColor.neutral[10].default,
  },
  error: {
    backgroundColor: tailwind.theme.backgroundColor.neutral[15].default,
    borderColor: tailwind.theme.borderColor.error[1].default,
    textColor: tailwind.theme.textColor.neutral[10].default,
  },
  disabled: {
    backgroundColor: tailwind.theme.backgroundColor.neutral[1].default,
    borderColor: tailwind.theme.borderColor.neutral[1].disable,
    textColor: tailwind.theme.textColor.neutral[5].default,
  },
} as const;

const textInputSizes = {
  lg: {
    borderRadius: Number(tailwind.theme.borderRadius.xl),
    paddingVertical: Number(tailwind.theme.spacing["4"]),
    paddingRight: Number(tailwind.theme.spacing["2"]),
    paddingLeft: Number(tailwind.theme.spacing["3"]),
  },
  md: {
    borderRadius: Number(tailwind.theme.borderRadius.xl),
    paddingVertical: Number(tailwind.theme.spacing["3"]),
    paddingRight: Number(tailwind.theme.spacing["2"]),
    paddingLeft: Number(tailwind.theme.spacing["3"]),
  },
  sm: {
    borderRadius: Number(tailwind.theme.borderRadius.lg),
    paddingVertical: Number(tailwind.theme.spacing["1"]),
    paddingRight: Number(tailwind.theme.spacing["2"]),
    paddingLeft: Number(tailwind.theme.spacing["2"]),
  },
} as const;

const getStateKey = (
  isTouched: boolean,
  disabled?: boolean,
  error?: FieldError,
) => {
  if (disabled) return "disabled";
  if (error) return "error";
  if (isTouched) return "focus";
  return "default";
};

type Props<T extends FieldValues> = UseControllerProps<T> & {
  clearErrors: UseFormClearErrors<T>;
  title?: string;
  size?: keyof typeof textInputSizes;
  icon?: SvgImage;
  autoFocus?: boolean;
  maskInReplay?: boolean;
} & TextInputProps;

export const TextInput = <T extends FieldValues>({
  name,
  control,
  clearErrors,
  title,
  icon,
  size = "lg",
  autoFocus,
  maskInReplay = false,
  ...textInputProps
}: Props<T>) => {
  const [isFocused, setIsFocused] = useState(false);
  const ref = useRef<RNTextInput>(null);

  const focusProgress = useSharedValue(0);

  useEffect(() => {
    if (autoFocus) {
      ref.current?.focus();
    }
  }, [autoFocus]);

  useEffect(() => {
    focusProgress.value = withTiming(isFocused ? 1 : 0, { duration: 500 });
  }, [focusProgress, isFocused]);

  const animatedStyle = useAnimatedStyle(() => {
    const borderColor = interpolateColor(
      focusProgress.value,
      [0, 1],
      [textInputStates.default.borderColor, textInputStates.focus.borderColor],
    );
    return { borderColor };
  });

  return (
    <Controller
      control={control}
      name={name}
      render={({
        field: { onChange, value, disabled },
        fieldState: { error },
      }) => {
        const onChangeText = (text: string) => {
          onChange(text);
          if (error) clearErrors([name]);
        };

        const currentStateKey = getStateKey(isFocused, disabled, error);
        const shouldUseAnimation = !error && !disabled;

        return (
          <View className={"flex flex-col gap-2"}>
            {title && (
              <Text className={"body-b2 text-neutral-10-default"}>{title}</Text>
            )}

            <Animated.View
              className={"flex flex-row items-center justify-between gap-2"}
              style={[
                {
                  backgroundColor:
                    textInputStates[currentStateKey].backgroundColor + "b3",
                  // Static border color (fallback for error/disabled)
                  borderColor: textInputStates[currentStateKey].borderColor,
                  borderRadius: textInputSizes[size].borderRadius,
                  borderWidth: 1,
                  paddingVertical: textInputSizes[size].paddingVertical,
                  paddingRight: textInputSizes[size].paddingRight,
                  paddingLeft: textInputSizes[size].paddingLeft,
                },
                shouldUseAnimation ? animatedStyle : undefined,
              ]}
            >
              {icon && <Icon i={icon} />}
              <RNTextInput
                {...textInputProps}
                ref={ref}
                {...(maskInReplay ? { "ph-no-capture": true } : {})} // posthog prop to mask or not the input
                className={"body-b1-text-input flex-grow"}
                style={{
                  color: textInputStates[currentStateKey].textColor,
                }}
                placeholderTextColor={
                  tailwind.theme.textColor.neutral[3].default
                }
                onChangeText={onChangeText}
                value={value}
                onFocus={(e) => {
                  setIsFocused(true);
                  textInputProps.onFocus?.(e);
                }}
                onBlur={(e) => {
                  setIsFocused(false);
                  textInputProps.onBlur?.(e);
                }}
              />

              <Button
                variant={"link"}
                iconOnly
                onPress={() => onChangeText("")}
                className={cn(
                  !!value && isFocused ? "opacity-100" : "opacity-0",
                )}
              >
                <Icon i={Xmark} />
              </Button>
            </Animated.View>

            {error?.message && (
              <View className={"flex flex-row items-center gap-1"}>
                <Icon
                  i={InfoCircle}
                  color={tailwind.theme.textColor.error[1].default}
                  height={16}
                  width={16}
                />
                <Text className={"caption-c1 text-error-1-default"}>
                  {error?.message}
                </Text>
              </View>
            )}
          </View>
        );
      }}
    />
  );
};
