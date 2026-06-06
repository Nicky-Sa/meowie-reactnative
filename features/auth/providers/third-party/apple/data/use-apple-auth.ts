import { useCallback } from "react";
import * as AppleAuthentication from "expo-apple-authentication";
import { useMutationConfigured } from "@/features/common/data/query/hooks";
import { createSession } from "@/features/common/data/utils/create-session";
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

      // Save session
      await createSession({
        accessToken: response.data.accessToken,
        refreshToken: response.data.refreshToken,
      });

      await revalidateAuth();

      return response.data;
    } catch (err: unknown) {
      const e = err as { code?: string; message?: string };
      if (
        e.code === "ERR_REQUEST_CANCELED" ||
        e.message === "The user canceled the authorization attempt" ||
        e.message?.includes("canceled")
      ) {
        // handle that the user canceled the sign-in flow
        return;
      } else {
        // handle other errors
        Toast.show({
          type: "error",
          text1: "Failed to sign in with Apple",
        });
        console.error(e);
      }
      throw e;
    }
  }, [mutateApple, revalidateAuth]);

  return { loginWithApple };
};
