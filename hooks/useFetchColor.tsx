import { useEffect, useState } from "react";
import { getColors } from "react-native-image-colors";

export const useFetchColor = (imageUri: string) => {
  const [colors, setColors] = useState<[string, ...string[]]>(["#737373"]);

  useEffect(() => {
    const fetchColors = async (imageUri: string) => {
      try {
        const colors = await getColors(imageUri, {
          fallback: "#000000",
          cache: true,
          key: imageUri,
        });
        console.log(colors);
        if (colors.platform === "android") {
          setColors([colors.dominant]);
        }
        if (colors.platform === "ios") {
          setColors([colors.primary]);
        }
      } catch (error) {
        console.error("Error fetching image colors:", error);
      }
    };

    fetchColors(imageUri);
  }, [imageUri]);

  return colors;
};
