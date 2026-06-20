import { Text, View } from "react-native";
import { Button } from "@/features/common/ui/button";
import ErrorStateSvg from "@/assets/images/errors/error-state.svg";

type Props = {
  tryAgain: () => void;
  error: Error | string | null;
};

export const ErrorState = ({ tryAgain, error }: Props) => {
  return (
    <View
      className={
        "flex-1 flex-col items-center justify-center gap-8 bg-neutral-15-default"
      }
    >
      <ErrorStateSvg />
      <Text className={"body-b1 text-center text-neutral-5-default"}>
        {error ? String(error) : "We have a problem, please try again."}
      </Text>
      <Button onPress={tryAgain} variant={"white"}>
        Try again
      </Button>
    </View>
  );
};
