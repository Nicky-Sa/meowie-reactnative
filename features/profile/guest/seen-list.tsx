import { View } from "react-native";
import EmptySeen from "@/assets/images/meowie/empty-seen.svg";
import { Button } from "@/features/common/ui/button";
import { useRouter } from "expo-router";
import { InformationBlock } from "@/features/common/information-block";

type Props = {
  headerHeight: number;
};

export const SeenList = ({ headerHeight }: Props) => {
  const router = useRouter();

  return (
    <View className={"flex-1"} style={{ paddingTop: headerHeight }}>
      <InformationBlock
        img={EmptySeen}
        text={"Sign in to keep track of what you've seen."}
      >
        <Button
          variant={"white"}
          size={"md"}
          onPress={() => {
            router.push("/auth");
          }}
        >
          Login or Sign Up
        </Button>
      </InformationBlock>
    </View>
  );
};
