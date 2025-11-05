import { View, TextInput as RNTextInput, Text } from "react-native";
import {
  Controller,
  FieldError,
  FieldValues,
  UseControllerProps,
} from "react-hook-form";
import { TextInputProps } from "react-native/Libraries/Components/TextInput/TextInput";
import { tailwind } from "@/lib/utils";

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
    borderRadius: Number(tailwind.theme.borderRadius.lg),
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

type Props<T extends FieldValues> = UseControllerProps<T> &
  TextInputProps & {
    title: string;
    size?: keyof typeof textInputSizes;
  };

export const TextInput = <T extends FieldValues>({
  name,
  control,
  title,
  size = "lg",
  ...textInputProps
}: Props<T>) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({
        field: { onChange, value, disabled },
        fieldState: { error, isTouched },
      }) => (
        <View className={"flex flex-col gap-1"}>
          <Text className={"body-b2 text-neutral-10-default"}>{title}</Text>
          <RNTextInput
            {...textInputProps}
            className={"body-b1"}
            style={{
              backgroundColor:
                textInputStates[getStateKey(isTouched, disabled, error)]
                  .backgroundColor,
              borderColor:
                textInputStates[getStateKey(isTouched, disabled, error)]
                  .borderColor,
              color:
                textInputStates[getStateKey(isTouched, disabled, error)]
                  .textColor,
              borderRadius: textInputSizes[size].borderRadius,
              borderWidth: 1,
              paddingVertical: textInputSizes[size].paddingVertical,
              paddingRight: textInputSizes[size].paddingRight,
              paddingLeft: textInputSizes[size].paddingLeft,
            }}
            placeholderTextColor={tailwind.theme.textColor.neutral[3].default}
            onChangeText={onChange}
            value={value}
          />
          {error?.message && <Text>{error?.message}</Text>}
        </View>
      )}
    />
  );
};
