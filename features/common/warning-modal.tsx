import { Text } from "react-native";
import { Image, ImageSource } from "expo-image";
import { Button } from "@/features/common/button";
import { useState } from "react";
import { CenteredModal } from "@/features/common/centered-modal";

type Props = {
  imageSrc: ImageSource;
  warningText: string;
  dismissText: string;
};

export const WarningModal = ({ imageSrc, warningText, dismissText }: Props) => {
  const [warningVisible, setWarningVisible] = useState(true);

  return (
    <CenteredModal
      modalVisible={warningVisible}
      setModalVisible={setWarningVisible}
    >
      <Image
        source={imageSrc}
        style={{
          width: 150,
          height: 150,
          alignSelf: "center",
        }}
        contentFit="contain"
      />
      <Text className={"body-b1 text-center text-neutral-10-default"}>
        {warningText}
      </Text>
      <Button
        onPress={() => setWarningVisible(false)}
        variant={"primary"}
        size={"full"}
      >
        {dismissText}
      </Button>
    </CenteredModal>
  );
};
