import EmptySaved from "@/assets/images/meowie/empty-saved.svg";
import { View } from "react-native";
import { Button } from "@/features/common/ui/button";
import { useRouter } from "expo-router";
import { InformationBlock } from "@/features/common/information-block";

type Props = {
  headerHeight: number;
};

export const SavedList = ({ headerHeight }: Props) => {
  const router = useRouter();
  return (
    <View className={"flex-1"} style={{ paddingTop: headerHeight }}>
      <InformationBlock
        img={EmptySaved}
        text={"Sign in to start building your watchlist."}
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
