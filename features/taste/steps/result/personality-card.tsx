import { Image } from "expo-image";
import { tailwind } from "@/lib/tailwind";

// The share cards are drawn at 2160 x 3856.
const CARD_RATIO = 2160 / 3856;

type Props = {
  image: string;
};

// Width first, height from the ratio — the box has the card's shape, so the
// picture fills it and the rounded corners sit on the picture itself.
export const PersonalityCard = ({ image }: Props) => (
  <Image
    source={image}
    style={{
      width: "100%",
      aspectRatio: CARD_RATIO,
      borderRadius: Number(tailwind.theme.borderRadius["2xl"]),
    }}
    contentFit={"contain"}
    transition={300}
  />
);
