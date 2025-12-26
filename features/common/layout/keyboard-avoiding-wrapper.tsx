import { KeyboardAvoidingView, Platform } from "react-native";
import { PropsWithChildren } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type ScreenWrapperProps = {
  avoidKeyboard?: boolean; // pushes the content up when the keyboard is shown
};

export const KeyboardAvoidingWrapper = ({
  children,
  avoidKeyboard = true,
}: PropsWithChildren<ScreenWrapperProps>) => {
  const { bottom } = useSafeAreaInsets();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className={"flex-1"}
      enabled={avoidKeyboard}
      keyboardVerticalOffset={-1 * bottom} // keyboardVerticalOffset is set to a negative value to account for the safe area bottom inset
    >
      {children}
    </KeyboardAvoidingView>
  );
};
