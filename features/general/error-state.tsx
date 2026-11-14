import { Text, View } from "react-native";
import { Button } from "@/features/common/ui/button";
import ErrorStateSvg from "@/assets/images/errors/error-state.svg";
import { getErrorText } from "@/features/common/data/error";

type Props = {
  tryAgain: () => void;
  error: Error | string | null;
};

export const ErrorState = ({ tryAgain, error }: Props) => {
  const errorText = typeof error === "string" ? error : getErrorText(error);

  return (
    <View
      className={
        "flex-1 flex-col items-center justify-center gap-8 bg-neutral-15-default"
      }
    >
      <ErrorStateSvg />
      <Text className={"body-b1 max-w-xs text-center text-neutral-5-default"}>
        {errorText}
      </Text>
      <Button onPress={tryAgain} variant={"white"}>
        Try again
      </Button>
    </View>
  );
};
