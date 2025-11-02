import { Text, View } from "react-native";
import { Button } from "@/features/common/button";
import { ForwardRefExoticComponent, RefAttributes, useState } from "react";
import { CenteredModal } from "@/features/common/centered-modal";
import Svg, { SvgProps } from "react-native-svg";

type Props = {
  img: ForwardRefExoticComponent<SvgProps & RefAttributes<Svg>>;
  warningText: string;
  dismissText: string;
};

export const WarningModal = ({
  img: ImageComponent,
  warningText,
  dismissText,
}: Props) => {
  const [warningVisible, setWarningVisible] = useState(true);

  return (
    <CenteredModal
      modalVisible={warningVisible}
      setModalVisible={setWarningVisible}
    >
      <View
        className={
          "mx-6 flex flex-col items-center justify-center gap-6 rounded-xl bg-neutral-15-default px-4 py-6"
        }
      >
        <ImageComponent />
        <Text className={"body-b1 text-center text-neutral-10-default"}>
          {warningText}
        </Text>
        <Button
          onPress={() => setWarningVisible(false)}
          variant={"white"}
          size={"md"}
          className={"w-full"}
        >
          {dismissText}
        </Button>
      </View>
    </CenteredModal>
  );
};
