import { Text, View } from "react-native";
import { ComponentType, PropsWithChildren } from "react";

type Props = {
  img: ComponentType;
  text: string;
};

export const InformationBlock = ({
  img: ImageComponent,
  text,
  children,
}: PropsWithChildren<Props>) => {
  return (
    <View className="flex-1 flex-col items-center justify-center gap-8 bg-neutral-15-default">
      <ImageComponent />
      <Text className="body-b1 max-w-xs text-center text-neutral-5-default">
        {text}
      </Text>
      {children}
    </View>
  );
};
