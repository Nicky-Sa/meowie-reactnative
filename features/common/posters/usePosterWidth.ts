import { useScreenDimensions } from "@/hooks/useScreenDimensions";
import { tailwind } from "@/lib/tailwind";

type Args = {
  numColumns: number;
  gap?: number;
};

export const usePosterWidth = ({
  numColumns,
  gap = Number(tailwind.theme.gap["0.5"]),
}: Args) => {
  const { width } = useScreenDimensions();
  const posterWidth = Math.floor((width - (numColumns - 1) * gap) / numColumns);
  return { posterWidth };
};
