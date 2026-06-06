import { InnerScreen } from "@/features/common/layout/inner-screen";
import { ScrollView } from "react-native-gesture-handler";

export const Screen = () => {
  return (
    <InnerScreen
      title={"Share your taste"}
      subtitle={"You can change these later."}
    >
      <ScrollView></ScrollView>
    </InnerScreen>
  );
};
