import { PropsWithChildren } from "react";
import { TourGuideZone, TourGuideZoneProps } from "rn-tourguide";
import { TourStep, tourStepContent } from "./steps";

type TourConfig = Omit<
  TourGuideZoneProps,
  "children" | "isTourGuide" | "zone" | "text"
> & {
  step: TourStep;
  text?: string;
};

export type TourableProps = PropsWithChildren<{
  tour: TourConfig;
  tourEnabled?: boolean;
}>;

export const Tourable = ({
  tour,
  tourEnabled = true,
  children,
}: TourableProps) => {
  const text = tour.text ?? tourStepContent[tour.step];

  return (
    <TourGuideZone
      isTourGuide={tourEnabled}
      zone={tour.step}
      tooltipBottomOffset={tour.tooltipBottomOffset ?? 60}
      text={text}
      {...tour}
    >
      {children}
    </TourGuideZone>
  );
};
