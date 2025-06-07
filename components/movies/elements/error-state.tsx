import { Text, View } from "react-native";
import Rive, { Alignment } from "rive-react-native";
import { Button } from "@/components/common/button";
import { useScreenDimensions } from "@/hooks/useScreenDimensions";

type Props = {
  tryAgain: () => void;
};

export const MoviesErrorState = ({ tryAgain }: Props) => {
  const { height } = useScreenDimensions();

  return (
    <View
      className={"flex-col items-center justify-center gap-10"}
      style={{
        height,
      }}
    >
      <View className={"flex h-[25%] w-full flex-col gap-4"}>
        <Rive
          url="https://meowie-public.s3.eu-central-1.amazonaws.com/meowie-error-state.riv"
          alignment={Alignment.Center}
        />
        <Text className={"body-b1 text-center text-neutral-5-default"}>
          We have a problem, please try again
        </Text>
      </View>
      <Button haptic onPress={tryAgain} variant={"primary"}>
        Retry
      </Button>
    </View>
  );
};
