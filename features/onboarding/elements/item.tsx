import { Text, View } from "react-native";
import Rive, { Alignment } from "rive-react-native";

type Props = {
  riveUrl: string;
  title: string;
  body: string;
  height: `${number}%`;
};

export const OnboardingItem = ({ riveUrl, title, body, height }: Props) => {
  return (
    <View className={"flex h-full w-full flex-col justify-between px-6"}>
      <View
        style={{
          height,
        }}
      >
        <Rive url={riveUrl} alignment={Alignment.Center} />
      </View>
      <View className={"flex flex-col gap-2"}>
        <Text className={"title-t1-strong text-neutral-10-default"}>
          {title}
        </Text>
        <Text className={"body-b2 text-neutral-10-default"}>{body}</Text>
      </View>
    </View>
  );
};
