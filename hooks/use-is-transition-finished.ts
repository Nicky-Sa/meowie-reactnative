import { useEffect, useState } from "react";
import { useNavigation } from "expo-router";
import { NavigationProp, ParamListBase } from "expo-router/react-navigation";

/**
 * Returns true once the navigation transition is finished.
 * Uses the native 'transitionEnd' event for maximum accuracy.
 */
export const useIsTransitionFinished = () => {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    // Fallback timer in case transitionEnd doesn't fire (e.g. direct mount)
    const timeout = setTimeout(() => {
      setIsFinished(true);
    }, 600);

    const unsubscribe = navigation.addListener("transitionEnd" as never, () => {
      clearTimeout(timeout);
      setIsFinished(true);
    });

    return () => {
      clearTimeout(timeout);
      unsubscribe();
    };
  }, [navigation]);

  return isFinished;
};
