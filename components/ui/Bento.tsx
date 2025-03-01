import { PropsWithChildren } from "react";
import { LinearGradient } from "expo-linear-gradient";

type Props = {
  hasPadding?: boolean;
};

const Bento = ({ children, hasPadding = true }: PropsWithChildren<Props>) => {
  return (
    <LinearGradient
      colors={["#262626", "#171717"]}
      start={{ x: 0, y: 0.5 }}
      end={{ x: 1, y: 0.5 }}
      style={{
        borderRadius: 12,
        borderWidth: 1.5,
        borderColor: "#262626",
        width: "100%",
        padding: hasPadding ? 12 : 0,
      }}
    >
      {children}
    </LinearGradient>
  );
};
export default Bento;
