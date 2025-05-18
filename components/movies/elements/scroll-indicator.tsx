import Rive, { Alignment } from "rive-react-native";
import { View } from "react-native";
import { useEffect, useState } from "react";

export const ScrollIndicator = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShow(true);
    }, 3000);
    return () => clearTimeout(timeout);
  }, []);

  return (
    show && (
      <View className={"absolute bottom-0 h-[15%] w-full"}>
        <Rive
          url="https://meowie-public.s3.eu-central-1.amazonaws.com/meowie-first-scroll-motion.riv"
          alignment={Alignment.Center}
        />
      </View>
    )
  );
};
