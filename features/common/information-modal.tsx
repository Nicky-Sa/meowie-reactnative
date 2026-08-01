import { Text, View } from "react-native";
import { ComponentType, PropsWithChildren } from "react";
import { CenteredModal } from "@/features/common/centered-modal";

type Props = {
  img: ComponentType;
  informationText: string;
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
};

export const InformationModal = ({
  img: ImageComponent,
  informationText,
  modalVisible,
  setModalVisible,
  children,
}: PropsWithChildren<Props>) => {
  return (
    <CenteredModal
      modalVisible={modalVisible}
      setModalVisible={setModalVisible}
    >
      <View
        className={
          "mx-6 flex flex-col items-center justify-center gap-6 rounded-xl bg-neutral-15-default p-8"
        }
      >
        <ImageComponent />
        <Text className={"body-b1 text-center text-neutral-10-default"}>
          {informationText}
        </Text>
        {/*The View below exists to make sure the buttons are full width*/}
        <View className={"flex flex-row"}>{children}</View>
      </View>
    </CenteredModal>
  );
};
