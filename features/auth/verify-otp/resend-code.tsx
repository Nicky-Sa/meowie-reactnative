import { Button } from "@/features/common/button";
import { useEffect, useState } from "react";

type Props = {
  onPress: () => void;
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

  return (
    <Button
      variant={"link"}
      size={"lg"}
      onPress={() => {
        setTimer(TIMER);
        onPress();
      }}
      disabled={timer > 0}
    >
      {text}
    </Button>
  );
};
