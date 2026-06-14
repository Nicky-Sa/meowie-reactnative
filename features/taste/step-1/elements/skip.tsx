import { useDismissScreen } from "@/features/auth/hooks/use-dismiss-screen";
import { Button } from "@/features/common/ui/button";

export const Skip = () => {
  const { dismissScreen } = useDismissScreen();

  const onPress = async () => {
    dismissScreen();
  };

  return (
    <Button onPress={onPress} variant={"ghost"} size={"md"}>
      Skip
    </Button>
  );
};
