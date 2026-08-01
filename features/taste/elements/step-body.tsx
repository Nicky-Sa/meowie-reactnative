import { PropsWithChildren, ReactNode } from "react";
import { View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

type Props = {
  footer?: ReactNode;
  // The poster deck flicks up and down itself, so those steps must not sit
  // inside a ScrollView — it would swallow the gesture.
  scrollable?: boolean;
};

// The header, progress bar, safe area and horizontal padding live in the
// journey layout, so a step only supplies its own content and footer.
export const StepBody = ({
  footer,
  scrollable = true,
  children,
}: PropsWithChildren<Props>) => (
  <View className={"flex flex-1 flex-col"}>
    {scrollable ? (
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName={"flex flex-col gap-4"}
      >
        {children}
      </ScrollView>
    ) : (
      <View className={"flex flex-1 flex-col gap-4"}>{children}</View>
    )}
    {footer ? (
      <View className={"flex flex-col gap-3 pt-4"}>{footer}</View>
    ) : null}
  </View>
);
