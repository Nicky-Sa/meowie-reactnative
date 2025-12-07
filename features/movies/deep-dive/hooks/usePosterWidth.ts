import { useScreenDimensions } from "@/hooks/useScreenDimensions";
import { tailwind } from "@/lib/utils";

type Args = {
  numColumns: number;
};

export const usePosterWidth = ({ numColumns }: Args) => {
  const { width } = useScreenDimensions();
  const availableWidth = width - 2 * Number(tailwind.theme.spacing[4]); // for padding x
  const posterWidth = Math.floor(availableWidth / numColumns);
  return { posterWidth };
};
