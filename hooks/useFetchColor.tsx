import { isDarkColor } from "@/lib/utils";
import { useEffect, useState } from "react";
import { getColors } from "react-native-image-colors";

export const useFetchColor = (imageUri?: string) => {
  const [color, setColor] = useState("#18181B");

  useEffect(() => {
    if (!imageUri) {
      return;
    }
    const fetchColors = async (imageUri: string) => {
      try {
        const result = await getColors(imageUri, {
          fallback: "#18181B",
          cache: true,
          key: imageUri,
        });
        if (result.platform === "android") {
          setColor(result.dominant);
        }
        if (result.platform === "ios") {
          isDarkColor(result.primary)
            ? isDarkColor(result.secondary)
              ? setColor(result.detail)
              : setColor(result.secondary)
            : setColor(result.primary);
        }
      } catch (error) {
        console.error("Error fetching image colors:", error);
      }
    };

    fetchColors(imageUri);
  }, [imageUri]);

  return color;
};
