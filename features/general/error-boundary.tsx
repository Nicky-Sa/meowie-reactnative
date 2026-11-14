import { ErrorBoundaryProps, useCanGoBack } from "expo-router";
import { ErrorState } from "@/features/general/error-state";
import { InnerScreen } from "@/features/common/layout/inner-screen";

type Props = ErrorBoundaryProps;

/** Shown in place of a screen, or of the whole app, when it throws while drawing. */
export const ErrorBoundary = ({ retry }: Props) => {
  const canGoBack = useCanGoBack();

  const tryAgain = () => {
    retry().catch((error: unknown) => {
      console.error("Could not draw the screen again:", error);
    });
  };

  // The broken screen's own header is gone, so this one brings the back arrow back.
  return canGoBack ? (
    <InnerScreen>
      <ErrorState tryAgain={tryAgain} error={null} />
    </InnerScreen>
  ) : (
    <ErrorState tryAgain={tryAgain} error={null} />
  );
};
