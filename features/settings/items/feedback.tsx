import { Icon } from "@/features/common/ui/icon";
import { NavArrowRight } from "iconoir-react-native";
import { useRouter } from "expo-router";
import { Action } from "@/features/common/ui/action";

export const Feedback = () => {
  const router = useRouter();

  return (
    <Action
      onPress={() => router.push("/settings/feedback")}
      icon={<Icon i={NavArrowRight} />}
    >
      Send feedback
    </Action>
  );
};
