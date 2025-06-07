import { useScreenDimensions } from "@/hooks/useScreenDimensions";

export const useTailwindBreakpoint = () => {
  const { width } = useScreenDimensions();

  switch (true) {
    case width < 350:
      return "xs";
    case width < 640:
      return "sm";
    case width < 768:
      return "md";
    case width < 1024:
      return "lg";
    case width < 1280:
      return "xl";
    case width < 1536:
      return "2xl";
    default:
      return "3xl";
  }
};
