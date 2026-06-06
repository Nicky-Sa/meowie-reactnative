import { Icon } from "@/features/common/ui/icon";
import { NavArrowRight } from "iconoir-react-native";
import { useRouter } from "expo-router";
import { Action } from "@/features/common/ui/action";

export const Taste = () => {
  const router = useRouter();

  return (
    <Action
      variant={"promoted"}
      onPress={() => router.push("/taste/step-1")}
      icon={<Icon i={NavArrowRight} />}
    >
      Share your taste
    </Action>
  );
};
