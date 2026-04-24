import { Action } from "@/features/common/ui/action";
import { NavArrowRight } from "iconoir-react-native";
import { Icon } from "@/features/common/ui/icon";
import { useRouter } from "expo-router";

export const DeleteAccount = () => {
  const router = useRouter();
  return (
    <Action
      onPress={() => router.push("/settings/delete-account")}
      icon={<Icon i={NavArrowRight} />}
    >
      Delete Account
    </Action>
  );
};
