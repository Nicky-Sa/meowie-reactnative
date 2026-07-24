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
      // Replace, not push: /taste and auth are siblings in the root stack, so
      // this swaps the whole auth flow out for the destination instead of
      // stacking it on top. Back from there goes to the original screen.
      router.replace(returnTo as Href);
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
