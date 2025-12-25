import { KeyboardAvoidingView, Platform } from "react-native";
import { PropsWithChildren } from "react";

type ScreenWrapperProps = {
  avoidKeyboard?: boolean; // pushes the content up when the keyboard is shown
};

export const KeyboardAvoidingWrapper = ({
  children,
  avoidKeyboard = true,
}: PropsWithChildren<ScreenWrapperProps>) => {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className={"flex-1"}
      enabled={avoidKeyboard}
    >
      {children}
    </KeyboardAvoidingView>
  );
};
