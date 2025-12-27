import { Text, View } from "react-native";
import { Button } from "@/features/common/ui/button";
import ErrorStateSvg from "@/assets/images/errors/error-state.svg";

type Props = {
  tryAgain: () => void;
  error: Error | undefined;
};

export const ErrorState = ({ tryAgain, error }: Props) => {
  return (
    <View className={"flex-1 flex-col items-center justify-center gap-8"}>
      <ErrorStateSvg />
      <Text className={"body-b1 text-center text-neutral-5-default"}>
        We have a problem, please try again.
      </Text>
      <Button onPress={tryAgain} variant={"white"}>
        Try again
      </Button>
      {process.env.NODE_ENV !== "production" && (
        <Text className={"body-b1 text-center text-neutral-5-default"}>
          {error ? String(error) : "Unknown error"}
        </Text>
      )}
    </View>
  );
};
