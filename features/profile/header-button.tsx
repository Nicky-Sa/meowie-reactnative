import { Button } from "@/features/common/ui/button";
import { Icon } from "@/features/common/ui/icon";
import { Settings } from "iconoir-react-native";
import { useRouter } from "expo-router";

export const ProfileHeaderButton = () => {
  const router = useRouter();
  return (
    <Button
      testID="settings"
      onPress={() => router.push("/settings")}
      variant={"ghost"}
      size={"md"}
      iconPosition={"only"}
      icon={<Icon i={Settings} />}
    />
  );
};
