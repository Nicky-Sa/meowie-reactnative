import { useRouter } from "expo-router";
import NoMatch from "@/assets/images/errors/no-match.svg";
import { Button } from "@/features/common/ui/button";
import { InformationBlock } from "@/features/common/information-block";

export const Screen = () => {
  const router = useRouter();

  return (
    <InformationBlock img={NoMatch} text={"This screen does not exist."}>
      <Button onPress={() => router.replace("/home")} variant={"white"}>
        Go to home screen
      </Button>
    </InformationBlock>
  );
};
