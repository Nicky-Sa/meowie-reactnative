import { Button } from "@/features/common/ui/button";
import ErrorStateSvg from "@/assets/images/errors/error-state.svg";
import { getErrorText } from "@/features/common/data/error";
import { InformationBlock } from "@/features/common/information-block";

type Props = {
  tryAgain: () => void;
  error: Error | string | null;
};

export const ErrorState = ({ tryAgain, error }: Props) => {
  const errorText = typeof error === "string" ? error : getErrorText(error);

  return (
    <InformationBlock img={ErrorStateSvg} text={errorText}>
      <Button onPress={tryAgain} variant={"white"}>
        Try again
      </Button>
    </InformationBlock>
  );
};
