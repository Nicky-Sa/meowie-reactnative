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
    <View className={"flex h-full flex-col justify-between"}>
      <View
        style={{
          height,
        }}
      >
        <Rive url={riveUrl} alignment={Alignment.Center} />
      </View>
      <View className={"flex flex-col gap-4"}>
        <Text className={"title-t1-strong text-neutral-10-default"}>
          {title}
        </Text>
        <Text className={"body-b2 text-neutral-10-default"}>{body}</Text>
      </View>
    </View>
  );
};
