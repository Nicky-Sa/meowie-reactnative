import { useEffect, useState } from "react";
import { getColors } from "react-native-image-colors";

export const useFetchColor = (imageUri: string) => {
  const [colors, setColors] = useState<[string, ...string[]]>(["#737373"]);

  useEffect(() => {
    const fetchColors = async (imageUri: string) => {
      try {
        const result = await getColors(imageUri, {
          fallback: "#000000",
          cache: true,
          key: imageUri,
        });
        console.log({result});
        if (result.platform === "android") {
          setColors([result.dominant]);
        }
        if (result.platform === "ios") {
          setColors([result.primary]);
        }
      } catch (error) {
        console.error("Error fetching image colors:", error);
      }
    };

    fetchColors(imageUri);
  }, [imageUri]);

  return colors;
};
