import { StyleSheet } from "react-native";
import { Image } from "expo-image";
import { GradientOverlay } from "@/features/common/ui/gradient-overlay";

// Dark under the headline and again under the watermark, near-clear across the
// middle so the poster still reads as a poster.
const DARK_OVERLAY_COLORS = [
  "rgba(0,0,0,0.85)",
  "rgba(0,0,0,0.55)",
  "rgba(0,0,0,0.15)",
  "rgba(0,0,0,0.75)",
];
const DARK_OVERLAY_POSITIONS = [0, 0.4, 0.62, 1];

type Props = {
  poster: string;
};

export const PersonalityPoster = ({ poster }: Props) => (
  <>
    <Image
      source={poster}
      style={StyleSheet.absoluteFill}
      contentFit={"cover"}
      transition={300}
    />
    {/* A dark overlay, because dimming the poster itself washes out the whole card. */}
    <GradientOverlay
      height={"102%"} // just to make sure it covers the entire poster
      colors={DARK_OVERLAY_COLORS}
      positions={DARK_OVERLAY_POSITIONS}
      className={"absolute inset-0"}
    />
  </>
);
