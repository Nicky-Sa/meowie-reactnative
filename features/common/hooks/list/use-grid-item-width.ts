import { useScreenDimensions } from "@/hooks/use-screen-dimensions";
import { tailwind } from "@/lib/tailwind";

type Args = {
  numColumns: number;
  gap?: number;
  // Total horizontal padding of the container. Defaults to 0 for full-screen
  // lists; padded grids (e.g. inside px-4) pass their combined side padding.
  horizontalPadding?: number;
};

// Since RN doesn't support grid, we have to use the math to drive the item width and use flex-row
export const useGridItemWidth = ({
  numColumns,
  gap = Number(tailwind.theme.gap["0.5"]),
  horizontalPadding = 0,
}: Args) => {
  const { width } = useScreenDimensions();
  const itemWidth = Math.floor(
    (width - horizontalPadding - (numColumns - 1) * gap) / numColumns,
  );
  return { itemWidth };
};
