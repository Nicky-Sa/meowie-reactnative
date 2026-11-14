import { useCallback } from "react";
import * as AppleAuthentication from "expo-apple-authentication";
import { getErrorText } from "@/features/common/data/error";
import { useMutationConfigured } from "@/features/common/data/query/hooks";
import { createSession } from "@/features/common/data/utils/session";
import { useRevalidateAuth } from "@/features/general/data/use-revalidate-auth";
import Toast from "react-native-toast-message";
import { AuthResDto, ThirdPartyAuthReqDto } from "@/features/auth/dto/auth.dto";

export const useAppleAuth = () => {
  const { revalidateAuth } = useRevalidateAuth();

  const { mutateAsync: mutateApple } = useMutationConfigured<
    ThirdPartyAuthReqDto,
    AuthResDto
  >("/auth/apple");

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
        throw new Error("No identity token from Apple");
      }

      // Send to backend
      const response = await mutateApple({
        method: "POST",
        body: { token: identityToken },
      });

      // Store session
      await createSession({
        accessToken: response.data.accessToken,
        refreshToken: response.data.refreshToken,
      });

      await revalidateAuth();

      return response.data;
    } catch (error: unknown) {
      const code =
        typeof error === "object" && error !== null && "code" in error
          ? error.code
          : undefined;
      const message = error instanceof Error ? error.message : "";
      if (code === "ERR_REQUEST_CANCELED" || message.includes("canceled")) {
        // handle that the user canceled the sign-in flow
        return;
      } else {
        // handle other errors
        Toast.show({
          type: "error",
          text1: "Failed to sign in with Apple",
          text2: getErrorText(error, 'Try "Continue with Email" instead'),
        });
      }
      throw error;
    }
  }, [mutateApple, revalidateAuth]);

  return { loginWithApple };
};
