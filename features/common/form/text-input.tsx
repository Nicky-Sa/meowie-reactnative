import { View, TextInput as RNTextInput, Text } from "react-native";
import {
  Controller,
  FieldError,
  FieldValues,
  UseControllerProps,
  UseFormClearErrors,
} from "react-hook-form";
import { TextInputProps } from "react-native/Libraries/Components/TextInput/TextInput";
import { tailwind } from "@/lib/tailwind";
import { Icon, SvgImage } from "@/features/common/icon";
import { InfoCircle, Xmark } from "iconoir-react-native";
import { Button } from "@/features/common/button";
import { useState } from "react";

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
  if (disabled) {
    return "disabled";
  }
  if (error) {
    return "error";
  }
  if (isTouched) {
    return "focus";
  }
  return "default";
};

type Props<T extends FieldValues> = UseControllerProps<T> & {
  clearErrors: UseFormClearErrors<T>;
  title?: string;
  size?: keyof typeof textInputSizes;
  icon?: SvgImage;
} & TextInputProps;

export const TextInput = <T extends FieldValues>({
  name,
  control,
  clearErrors,
  title,
  icon,
  size = "lg",
  ...textInputProps
}: Props<T>) => {
  const [isFocused, setIsFocused] = useState(false);

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
        return (
          <View className={"flex flex-col gap-2"}>
            {title && (
              <Text className={"body-b2 text-neutral-10-default"}>{title}</Text>
            )}

            <View
              className={"flex flex-row items-center justify-between gap-2"}
              style={{
                backgroundColor:
                  textInputStates[getStateKey(isFocused, disabled, error)]
                    .backgroundColor + "b3", // 70% opacity
                borderColor:
                  textInputStates[getStateKey(isFocused, disabled, error)]
                    .borderColor,
                borderRadius: textInputSizes[size].borderRadius,
                borderWidth: 1,
                paddingVertical: textInputSizes[size].paddingVertical,
                paddingRight: textInputSizes[size].paddingRight,
                paddingLeft: textInputSizes[size].paddingLeft,
              }}
            >
              {icon && <Icon i={icon} />}
              <RNTextInput
                {...textInputProps}
                className={"body-b1 flex-grow py-[3px]"}
                style={{
                  color:
                    textInputStates[getStateKey(isFocused, disabled, error)]
                      .textColor,
                }}
                placeholderTextColor={
                  tailwind.theme.textColor.neutral[3].default
                }
                onChangeText={onChangeText}
                value={value}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
              />
              {!!value && isFocused && (
                <Button
                  variant={"link"}
                  iconOnly
                  onPress={() => onChangeText("")}
                >
                  <Icon i={Xmark} />
                </Button>
              )}
            </View>

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
