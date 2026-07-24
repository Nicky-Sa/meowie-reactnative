import { PropsWithChildren, ReactElement } from "react";
import { AttachStep, ChildProps } from "react-native-spotlight-tour";
import { TourStep } from "./steps";

export type TourableProps = PropsWithChildren<{
  step: TourStep;
  tourEnabled?: boolean;
  // Stretch the measured wrapper to fill its parent instead of hugging the
  // child. Needed for elements that scroll or don't report their own width.
  fill?: boolean;
}>;

export const Tourable = ({
  step,
  tourEnabled = true,
  fill,
  children,
}: TourableProps) => {
  if (!tourEnabled) {
    return children;
  }

  // AttachStep injects ref/onLayout into the child at runtime via cloneElement,
  // so the wrapped element doesn't need to declare ChildProps itself.
  return (
    <AttachStep index={step} fill={fill}>
      {children as ReactElement<ChildProps>}
    </AttachStep>
  );
};
