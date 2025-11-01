import { Text, View } from "react-native";
import { Button } from "@/features/common/button";
import { useScreenDimensions } from "@/hooks/useScreenDimensions";
import ErrorState from "@/assets/images/errors/error-state.svg";

type Props = {
  tryAgain: () => void;
};

export const MoviesErrorState = ({ tryAgain }: Props) => {
  const { height } = useScreenDimensions();

  return (
    <View
      className={"flex-col items-center justify-center gap-8"}
      style={{
        height,
      }}
    >
      <ErrorState />
      <Text className={"body-b1 text-center text-neutral-5-default"}>
        We have a problem, please try again.
      </Text>
      <Button onPress={tryAgain} variant={"white"}>
        Try again
      </Button>
    </View>
  );
};
