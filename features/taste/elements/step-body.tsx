import { PropsWithChildren, ReactNode } from "react";
import { View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

type Props = {
  footer?: ReactNode;
};

/**
 * Per-step body shell: a scrollable content area and an optional pinned footer.
 * The header, progress bar, safe area, and the steps' horizontal padding all
 * live in the wizard layout, so a step only supplies its own content and footer.
 */
export const StepBody = ({ footer, children }: PropsWithChildren<Props>) => (
  <View className={"flex flex-1 flex-col"}>
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerClassName={"flex flex-col gap-4"}
    >
      {children}
    </ScrollView>
    {footer ? (
      <View className={"flex flex-col gap-3 pt-3"}>{footer}</View>
    ) : null}
  </View>
);
