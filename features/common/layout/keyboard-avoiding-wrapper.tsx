import { KeyboardAvoidingView, Platform } from "react-native";
import { PropsWithChildren } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { cn } from "@/lib/tailwind";

type ScreenWrapperProps = {
  avoidKeyboard?: boolean; // pushes the content up when the keyboard is shown
  className?: string;
};

export const KeyboardAvoidingWrapper = ({
  children,
  avoidKeyboard = true,
  className,
}: PropsWithChildren<ScreenWrapperProps>) => {
  const { bottom } = useSafeAreaInsets();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className={cn("flex-1", className)}
      enabled={avoidKeyboard}
      keyboardVerticalOffset={-0.5 * bottom} // keyboardVerticalOffset is set to a negative value to account for the safe area bottom inset
    >
      {children}
    </KeyboardAvoidingView>
  );
};
