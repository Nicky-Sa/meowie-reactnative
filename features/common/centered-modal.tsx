import { Modal, Pressable } from "react-native";
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
      animationType="fade"
      transparent
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(false);
      }}
    >
      <Pressable
        className={
          "flex-1 items-center justify-center bg-neutral-10-default/80"
        }
        onPress={() => setModalVisible(false)}
      >
        {children}
      </Pressable>
    </Modal>
  );
};
