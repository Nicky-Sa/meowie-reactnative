import { Text, View } from "react-native";
import { ComponentType, PropsWithChildren } from "react";

type Props = {
  img: ComponentType;
  title?: string;
  text: string;
};

export const InformationBlock = ({
  img: ImageComponent,
  title,
  text,
  children,
}: PropsWithChildren<Props>) => {
  return (
    <View className="flex-1 flex-col items-center justify-center gap-8 px-4">
      <ImageComponent />
      <View className="max-w-sm flex-col items-center gap-1">
        {title && (
          <Text className="title-t1-strong text-center text-neutral-10-default">
            {title}
          </Text>
        )}
        <Text className="body-b1 text-center text-neutral-5-default">
          {text}
        </Text>
      </View>
      {children}
    </View>
  );
};
