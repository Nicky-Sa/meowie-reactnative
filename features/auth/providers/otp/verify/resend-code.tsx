import { Button } from "@/features/common/ui/button";
import { useEffect, useState } from "react";

type Props = {
  /** Returns true when the new code was sent. */
  onPress: () => Promise<boolean>;
};

const TIMER = 120;

export const ResendCode = ({ onPress }: Props) => {
  const [timer, setTimer] = useState(TIMER);

  useEffect(() => {
    const id = setInterval(() => {
      setTimer((prevTimer) => prevTimer - 1);
    }, 1000);

    return () => {
      clearInterval(id);
    };
  }, []);
  const text = timer > 0 ? `Resend code (${timer})` : "Resend code";

  const handlePress = async () => {
    const isSent = await onPress();
    if (isSent) setTimer(TIMER);
  };

  return (
    <Button
      variant={"link"}
      size={"lg"}
      onPress={handlePress}
      disabled={timer > 0}
    >
      {text}
    </Button>
  );
};
