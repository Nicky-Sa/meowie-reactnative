import { useCallback } from "react";
import {
  GoogleSignin,
  statusCodes,
  isSuccessResponse,
} from "@react-native-google-signin/google-signin";
import * as AppleAuthentication from "expo-apple-authentication";
import { useMutationConfigured } from "@/features/common/data/query/hooks";
import { createSession } from "@/features/common/data/utils/create-session";
import { useRevalidateAuth } from "@/features/general/data/useRevalidateAuth";
import Toast from "react-native-toast-message";
import { env } from "@/lib/env";
import { AuthResDto, ThirdPartyAuthReqDto } from "@/features/auth/dto/auth.dto";

GoogleSignin.configure({
  webClientId: env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
  iosClientId: env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
});

export const useThirdPartyAuth = () => {
  const { mutateAsync: mutateGoogle } = useMutationConfigured<
    ThirdPartyAuthReqDto,
    AuthResDto
  >("/auth/google");
  const { mutateAsync: mutateApple } = useMutationConfigured<
    ThirdPartyAuthReqDto,
    AuthResDto
  >("/auth/apple");
  const { revalidateAuth } = useRevalidateAuth();

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
        throw new Error("No ID token from GoogleAuth");
      }

      // Send to backend
      const response = await mutateGoogle({
        method: "POST",
        body: { token: idToken },
      });

      // Save session
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
        Toast.show({ type: "error", text1: "Play services not available" });
      } else {
        // some other error happened
        Toast.show({
          type: "error",
          text1: "Failed to sign in with GoogleAuth",
        });
        console.error(error);
      }
      throw error;
    }
  }, [mutateGoogle, revalidateAuth]);

  const loginWithApple = useCallback(async () => {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      const identityToken = credential.identityToken;

      if (!identityToken) {
        throw new Error("No identity token from AppleAuth");
      }

      // Send to backend
      const response = await mutateApple({
        method: "POST",
        body: { token: identityToken },
      });

      // Save session
      await createSession({
        accessToken: response.data.accessToken,
        refreshToken: response.data.refreshToken,
      });

      await revalidateAuth();

      return response.data;
    } catch (err: unknown) {
      const e = err as { code?: string };
      if (e.code === "ERR_REQUEST_CANCELED") {
        // handle that the user canceled the sign-in flow
      } else {
        // handle other errors
        Toast.show({
          type: "error",
          text1: "Failed to sign in with AppleAuth",
        });
        console.error(e);
      }
      throw e;
    }
  }, [mutateApple, revalidateAuth]);

  return { loginWithGoogle, loginWithApple };
};
