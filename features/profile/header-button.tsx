import { Button } from "@/features/common/button";
import { Icon } from "@/features/common/icon";
import { Settings } from "iconoir-react-native";
import { useRouter } from "expo-router";

export const ProfileHeaderButton = () => {
  const router = useRouter();
  return (
    <Button
      onPress={() => router.push("/settings")}
      variant={"ghost"}
      size={"md"}
      iconOnly
    >
      <Icon i={Settings} />
    </Button>
  );
};
