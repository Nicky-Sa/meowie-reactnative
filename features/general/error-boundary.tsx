import { View } from "react-native";
import { ErrorBoundaryProps, useCanGoBack } from "expo-router";
import { ErrorState } from "@/features/general/error-state";
import { InnerScreen } from "@/features/common/layout/inner-screen";

type Props = ErrorBoundaryProps;

/** Shown in place of a screen, or of the whole app, when it throws while drawing. */
export const ErrorBoundary = ({ error, retry }: Props) => {
  const canGoBack = useCanGoBack();

  // The broken screen's own header is gone, so this one brings the back arrow back.
  return canGoBack ? (
    <InnerScreen>
      <ErrorState tryAgain={retry} error={error} />
    </InnerScreen>
  ) : (
    // When the whole app breaks, the root layout's background is gone too.
    <View className={"flex-1 bg-neutral-15-default"}>
      <ErrorState tryAgain={retry} error={error} />
    </View>
  );
};
