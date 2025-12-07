import { useScreenDimensions } from "@/hooks/useScreenDimensions";

type Args = {
  numColumns: number;
};

export const usePosterWidth = ({ numColumns }: Args) => {
  const { width } = useScreenDimensions();
  const posterWidth = Math.floor(width / numColumns);
  return { posterWidth };
};
