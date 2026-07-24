import { Image } from "expo-image";
import { View } from "react-native";

// The share cards are drawn at 2160 x 3856.
const CARD_RATIO = 2160 / 3856;

type Props = {
  image: string;
};

export const PersonalityCard = ({ image }: Props) => (
  // Height first, width from the ratio — capped so a short screen letterboxes
  // the card instead of pushing it off the sides.
  <View
    className={"h-full overflow-hidden rounded-3xl"}
    style={{ aspectRatio: CARD_RATIO, maxWidth: "100%" }}
  >
    <Image
      source={image}
      className={"h-full w-full"}
      contentFit={"contain"}
      transition={300}
    />
  </View>
);
