import { Pressable, Text } from "react-native";
import Animated, {
  Extrapolation,
  SharedValue,
  interpolate,
  interpolateColor,
  useAnimatedStyle,
} from "react-native-reanimated";
import { tailwind } from "@/lib/tailwind";

// Box sizes from the design: 64 when picked, then 48, 44 and 40 going outward.
const DISTANCES = [0, 1, 2, 3];
const BOX_SIZES = [64, 48, 44, 40];
const OPACITIES = [1, 0.85, 0.65, 0.45];
const GAP = Number(tailwind.theme.spacing["3"]);

// The picked box and its neighbour are half in each slot, so the slot has to
// hold half of both plus the gap to leave exactly GAP between them.
export const ITEM_WIDTH = (BOX_SIZES[0] + BOX_SIZES[1]) / 2 + GAP;

const SCALES = BOX_SIZES.map((size) => size / BOX_SIZES[0]);

// How far each box sits from the picked one once every gap is GAP wide. Slots
// are all one width, so the boxes further out have to slide back inward by the
// room their shrinking freed up.
const SLIDE_DISTANCES = [...DISTANCES, DISTANCES.length];
const SLIDE_OFFSETS = SLIDE_DISTANCES.reduce<number[]>(
  (offsets, _unused, step) => {
    if (step === 0) return [0];
    const inner = BOX_SIZES[step - 1];
    const outer = BOX_SIZES[step] ?? BOX_SIZES[BOX_SIZES.length - 1];
    return [...offsets, offsets[step - 1] + (inner + outer) / 2 + GAP];
  },
  [],
);

const PICKED_BORDER = tailwind.theme.borderColor.brand[1].default;
const PLAIN_BORDER = tailwind.theme.borderColor.neutral[3].default;

// The box is scaled, and so is its border, so 2 on the neighbour lands on the
// 1.5 hairline the design uses everywhere but the picked box.
const PICKED_BORDER_WIDTH = 4;
const PLAIN_BORDER_WIDTH = 2;

type Props = {
  label: string;
  index: number;
  scrollOffset: SharedValue<number>;
  onPress: () => void;
};

export const RatingButton = ({
  label,
  index,
  scrollOffset,
  onPress,
}: Props) => {
  const boxStyle = useAnimatedStyle(() => {
    const slotsFromPicked = index - scrollOffset.value / ITEM_WIDTH;
    const distance = Math.abs(slotsFromPicked);
    const wantedOffset =
      Math.sign(slotsFromPicked) *
      interpolate(
        distance,
        SLIDE_DISTANCES,
        SLIDE_OFFSETS,
        Extrapolation.EXTEND,
      );
    return {
      opacity: interpolate(distance, DISTANCES, OPACITIES, Extrapolation.CLAMP),
      transform: [
        { translateX: wantedOffset - slotsFromPicked * ITEM_WIDTH },
        {
          scale: interpolate(distance, DISTANCES, SCALES, Extrapolation.CLAMP),
        },
      ],
      borderColor: interpolateColor(
        distance,
        [0, 0.5],
        [PICKED_BORDER, PLAIN_BORDER],
      ),
      borderWidth: interpolate(
        distance,
        [0, 0.5],
        [PICKED_BORDER_WIDTH, PLAIN_BORDER_WIDTH],
        Extrapolation.CLAMP,
      ),
    };
  });

  return (
    <Pressable
      onPress={onPress}
      className={"h-16 items-center justify-center"}
      style={{ width: ITEM_WIDTH }}
    >
      <Animated.View
        className={"h-16 w-16 items-center justify-center rounded-xl"}
        style={boxStyle}
      >
        <Text
          className={"title-t2-strong text-neutral-10-default"}
          numberOfLines={1}
        >
          {label}
        </Text>
      </Animated.View>
    </Pressable>
  );
};
