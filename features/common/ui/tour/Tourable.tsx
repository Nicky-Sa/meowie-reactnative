import { PropsWithChildren } from "react";
import { TourGuideZone, TourGuideZoneProps } from "rn-tourguide";
import { TourStep } from "./steps";

export type TourableProps = PropsWithChildren<{
  tour:
    | (Omit<TourGuideZoneProps, "children" | "isTourGuide" | "zone"> & {
        step: TourStep;
      })
    | null;
}>;

export const Tourable = ({ tour, children }: TourableProps) => {
  return (
    <TourGuideZone
      isTourGuide={!!tour}
      zone={tour?.step ?? 0}
      tooltipBottomOffset={tour?.tooltipBottomOffset ?? 60}
      {...tour}
    >
      {children}
    </TourGuideZone>
  );
};
