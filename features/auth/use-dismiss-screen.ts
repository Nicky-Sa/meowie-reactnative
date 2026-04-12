import { useRouter, useNavigation } from "expo-router";

export const useDismissScreen = () => {
  const router = useRouter();
  const navigation = useNavigation();

  const dismissScreen = () => {
    const parentNavigation = navigation.getParent();
    if (parentNavigation && parentNavigation.canGoBack()) {
      parentNavigation.goBack();
    } else {
      router.replace("/home");
    }
  };

  return { dismissScreen };
};
