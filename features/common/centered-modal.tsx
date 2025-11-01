import { Modal, View } from "react-native";
import { PropsWithChildren } from "react";

type Props = {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
};

export const CenteredModal = ({
  modalVisible,
  setModalVisible,
  children,
}: PropsWithChildren<Props>) => {
  return (
    <Modal
      animationType="slide"
      transparent
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(false);
      }}
    >
      <View
        className={
          "flex-1 items-center justify-center bg-neutral-10-default/80"
        }
      >
        <View
          className={
            "mx-6 flex-col gap-4 rounded-xl bg-neutral-15-default px-4 py-6"
          }
        >
          {children}
        </View>
      </View>
    </Modal>
  );
};
