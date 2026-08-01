import { InformationModal } from "@/features/common/information-modal";
import { Button } from "@/features/common/ui/button";
import { useRouter } from "expo-router";
import { ComponentType } from "react";

type Props = {
  img: ComponentType;
  text: string;
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
  /** Where to send the user once they finish logging in. */
  returnTo?: string;
};

export const LoginWarningModal = ({
  img,
  text,
  modalVisible,
  setModalVisible,
  returnTo,
}: Props) => {
  const router = useRouter();

  return (
    <InformationModal
      img={img}
      informationText={text}
      modalVisible={modalVisible}
      setModalVisible={setModalVisible}
    >
      <Button
        onPress={() => {
          router.push(
            returnTo ? { pathname: "/auth", params: { returnTo } } : "/auth",
          );
          setModalVisible(false);
        }}
        variant={"white"}
        size={"md"}
        className={"w-full"}
      >
        Login or Sign Up
      </Button>
    </InformationModal>
  );
};
