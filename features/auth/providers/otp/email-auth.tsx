import { Button } from "@/features/common/ui/button";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Icon } from "@/features/common/ui/icon";
import { Mail } from "iconoir-react-native";
import { tailwind } from "@/lib/tailwind";

export const EmailAuth = () => {
  const router = useRouter();
  const { returnTo } = useLocalSearchParams<{ returnTo?: string }>();

  const handleEmail = () => {
    router.push({ pathname: "/auth/otp/request", params: { returnTo } });
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
