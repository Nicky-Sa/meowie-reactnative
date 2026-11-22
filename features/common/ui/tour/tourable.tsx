import { ReactElement } from "react";
import { AttachStep, ChildProps } from "react-native-spotlight-tour";
import { TourStep } from "@/features/common/ui/tour/steps";

export type TourableProps = {
  step: TourStep;
  tourEnabled?: boolean;
  // Stretch the measured wrapper to fill its parent instead of hugging the
  // child. Needed for elements that scroll or don't report their own width.
  fill?: boolean;
  // AttachStep reads its child's props, so two or more children crash the app
  children: ReactElement<ChildProps>;
};

export const Tourable = ({
  step,
  tourEnabled = true,
  fill,
  children,
}: TourableProps) => {
  if (!tourEnabled) {
    return children;
  }

  // AttachStep puts its own View around the child and measures that View,
  // so the child doesn't need to take ChildProps' ref itself.
  return (
    <AttachStep index={step} fill={fill}>
      {children}
    </AttachStep>
  );
};
