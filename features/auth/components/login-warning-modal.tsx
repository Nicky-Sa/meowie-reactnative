import { InformationModal } from "@/features/common/information-modal";
import { Button } from "@/features/common/ui/button";
import { useRouter } from "expo-router";
import { SvgImage } from "@/features/common/ui/icon";

type Props = {
  img: SvgImage;
  text: string;
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
};

export const LoginWarningModal = ({
  img,
  text,
  modalVisible,
  setModalVisible,
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
          router.push("/auth");
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
