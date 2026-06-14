import { useRouter, useNavigation } from "expo-router";
import { Href } from "expo-router/build/types";

type Args = {
  returnTo?: string;
};

export const useDismissScreen = ({ returnTo }: Args = {}) => {
  const router = useRouter();
  const navigation = useNavigation();

  const dismissScreen = () => {
    if (returnTo) {
      router.push(returnTo as Href);
    } else {
      const parentNavigation = navigation.getParent();
      if (parentNavigation && parentNavigation.canGoBack()) {
        parentNavigation.goBack();
      } else {
        router.replace("/home");
      }
    }
  };

  return { dismissScreen };
};
