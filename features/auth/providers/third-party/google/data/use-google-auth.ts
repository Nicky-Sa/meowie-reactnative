import { useCallback } from "react";
import {
  GoogleSignin,
  statusCodes,
  isSuccessResponse,
} from "@react-native-google-signin/google-signin";
import { useMutationConfigured } from "@/features/common/data/query/hooks";
import { createSession } from "@/features/common/data/utils/session";
import { useRevalidateAuth } from "@/features/general/data/use-revalidate-auth";
import Toast from "react-native-toast-message";
import { env } from "@/lib/env";
import { AuthResDto, ThirdPartyAuthReqDto } from "@/features/auth/dto/auth.dto";

GoogleSignin.configure({
  webClientId: env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
  iosClientId: env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
});

export const useGoogleAuth = () => {
  const { revalidateAuth } = useRevalidateAuth();

  const { mutateAsync: mutateGoogle } = useMutationConfigured<
    ThirdPartyAuthReqDto,
    AuthResDto
  >("/auth/google");

  const loginWithGoogle = useCallback(async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();

      if (!isSuccessResponse(userInfo)) {
        // user cancelled the login flow or something similar
        return;
      }

      const idToken = userInfo.data.idToken;

      if (!idToken) {
        throw new Error("No ID token from Google");
      }

      // Send to backend
      const response = await mutateGoogle({
        method: "POST",
        body: { token: idToken },
      });

      // Store session
      await createSession({
        accessToken: response.data.accessToken,
        refreshToken: response.data.refreshToken,
      });

      await revalidateAuth();

      return response.data;
    } catch (err: unknown) {
      const error = err as { code?: string };
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
        Toast.show({
          type: "error",
          text1: "Google Play services not available",
        });
      } else {
        // some other error happened
        Toast.show({
          type: "error",
          text1: "Failed to sign in with Google",
        });
        console.error(error);
      }
      throw error;
    }
  }, [mutateGoogle, revalidateAuth]);

  return { loginWithGoogle };
};
