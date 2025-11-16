import { useState } from "react";
import { Pressable, View } from "react-native";
import { Image } from "expo-image";
import { tailwind } from "@/lib/utils";
import { CenteredModal } from "@/features/common/centered-modal";
import { Button } from "@/features/common/button";

type Props = {
  source: string;
  blurhash: string;
};

export const EnlargeableImage = ({ source, blurhash }: Props) => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <>
      <Pressable onPress={() => setModalVisible(true)}>
        <Image
          source={source}
          style={{
            aspectRatio: 2 / 3,
            width: 60,
            borderRadius: Number(tailwind.theme.borderRadius.lg),
          }}
          contentFit="cover"
          placeholder={{
            blurhash: blurhash,
            width: 100,
            height: 150,
          }}
          transition={500}
        />
      </Pressable>

      <CenteredModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
      >
        <View className={"mx-6 flex-col gap-4 rounded-xl px-4 py-6"}>
          <Image
            source={source}
            style={{
              aspectRatio: 2 / 3,
              width: 300,
              borderRadius: Number(tailwind.theme.borderRadius.lg),
            }}
            contentFit="cover"
          />
          <Button
            onPress={() => setModalVisible(false)}
            variant={"ghost"}
            size={"md"}
          >
            Close
          </Button>
        </View>
      </CenteredModal>
    </>
  );
};
