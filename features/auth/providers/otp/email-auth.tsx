import { Button } from "@/features/common/ui/button";
import { useRouter } from "expo-router";
import { Icon } from "@/features/common/ui/icon";
import { Mail } from "iconoir-react-native";
import { tailwind } from "@/lib/tailwind";

export const EmailAuth = () => {
  const router = useRouter();

  const handleEmail = () => {
    router.push("/auth/otp/request");
  };

  return (
    <Button
      variant="white"
      size="lg"
      icon={
        <Icon
          i={Mail}
          color={tailwind.theme.backgroundColor.neutral[15].default}
        />
      }
      onPress={handleEmail}
    >
      Continue with Email
    </Button>
  );
};
