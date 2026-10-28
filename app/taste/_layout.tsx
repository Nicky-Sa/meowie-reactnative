import { Redirect, Stack, useNavigation, usePathname } from "expo-router";
import { useEffect } from "react";
import { BackHandler, View } from "react-native";
import { useAtomValue } from "jotai";
import { tasteAtom } from "@/atoms";
import { useCurrentUser } from "@/features/general/data/use-current-user";
import { Loading } from "@/features/common/ui/loading";
import { ErrorState } from "@/features/general/error-state";

// Back stays blocked while submitting to avoid sending the same answers twice.
export default function TasteLayout() {
  const pathname = usePathname();
  const rootNavigation = useNavigation("/");
  const isSubmittingTaste = pathname === "/taste/result";
  const {
    data,
    isPending: isCurrentUserPending,
    error: currentUserError,
    refetch: refetchCurrentUser,
  } = useCurrentUser();
  const taste = useAtomValue(tasteAtom);

  useEffect(() => {
    rootNavigation.setOptions({ gestureEnabled: !isSubmittingTaste });
  }, [rootNavigation, isSubmittingTaste]);

  useEffect(() => {
    if (!isSubmittingTaste) return;
    const listener = BackHandler.addEventListener(
      "hardwareBackPress",
      () => true,
    );
    return () => listener.remove();
  }, [isSubmittingTaste]);

  if (isCurrentUserPending) {
    return (
      <View className={"flex-1 justify-center"}>
        <Loading />
      </View>
    );
  }

  if (currentUserError) {
    return (
      <ErrorState tryAgain={refetchCurrentUser} error={currentUserError} />
    );
  }

  if (!isSubmittingTaste && taste.completed) {
    if (data?.user) return <Redirect href="/taste/result" />;
    return (
      <Redirect href={{ pathname: "/auth", params: { returnTo: "/home" } }} />
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(journey)" />
      <Stack.Screen
        name="result"
        options={{ animation: "fade", gestureEnabled: false }}
      />
    </Stack>
  );
}
