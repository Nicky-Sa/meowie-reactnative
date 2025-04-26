import { isDarkColor, isUrl } from "@/lib/utils";
import { useEffect, useState } from "react";
import { getColors } from "react-native-image-colors";

export const useFetchColor = (imageUri: string | undefined) => {
  const fallbackColor = "#1F3854";
  const [color, setColor] = useState(fallbackColor);
  useEffect(() => {
    if (!imageUri || !isUrl(imageUri)) {
      return;
    }
    const fetchColors = async (imageUri: string) => {
      try {
        const result = await getColors(imageUri, {
          fallback: fallbackColor,
          cache: true,
          key: imageUri,
        });
        if (result.platform === "android") {
          setColor(result.dominant);
        }
        if (result.platform === "ios") {
          if (isDarkColor(result.primary)) {
            if (isDarkColor(result.secondary)) {
              setColor(result.detail);
            } else {
              setColor(result.secondary);
            }
          } else {
            setColor(result.primary);
          }
        }
      } catch (error) {
        console.error("Error fetching image colors:", error);
      }
    };

    fetchColors(imageUri).then();
  }, [imageUri]);

  return color;
};
