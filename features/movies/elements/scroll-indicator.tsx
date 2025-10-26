import Rive, { Alignment } from "rive-react-native";
import { useEffect, useState } from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";
import { Portal } from "@gorhom/portal";

type Props = {
  shouldShow: boolean;
};

export const ScrollIndicator = ({ shouldShow }: Props) => {
  const [show, setShow] = useState(false);
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
      opacity: opacity.value,
    };
  });

  // Show animation when component mounts
  useEffect(() => {
    if (shouldShow) {
      const showTimeout = setTimeout(() => {
        setShow(true);
        opacity.value = withTiming(1, { duration: 500 });
      }, 3000);

      return () => clearTimeout(showTimeout);
    }
  }, [shouldShow, opacity]);

  // Hide animation when shouldRenderScrollIndicator becomes false
  useEffect(() => {
    if (!shouldShow && show) {
      translateY.value = withTiming(100, { duration: 1000 }, () => {
        scheduleOnRN(setShow, false);
      });
      opacity.value = withTiming(0, { duration: 1000 });
    }
  }, [shouldShow, show, translateY, opacity]);

  if (!show) return null;

  return (
    <Portal hostName="global-overlay">
      <Animated.View
        style={[
          {
            position: "absolute",
            zIndex: 11,
            bottom: 0,
            height: "15%",
            width: "25%",
            alignSelf: "center",
          },
          animatedStyle,
        ]}
      >
        <Rive
          url="https://meowie-public.s3.eu-central-1.amazonaws.com/meowie-first-scroll-motion.riv"
          alignment={Alignment.Center}
        />
      </Animated.View>
    </Portal>
  );
};
