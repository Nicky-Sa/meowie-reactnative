import { View } from "react-native";
import { TextInput } from "@/features/common/form/text-input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/features/common/ui/button";
import { useVerifyOtp } from "@/features/auth/providers/otp/verify/data/use-verify-otp";
import { useRequestOtp } from "@/features/auth/providers/otp/request/data/use-request-otp";
import { ResendCode } from "@/features/auth/providers/otp/verify/resend-code";
import { useDismissScreen } from "@/features/auth/hooks/use-dismiss-screen";
import { useAnalytics } from "@/features/general/posthog/hook/use-analytics";
import Toast from "react-native-toast-message";
import { useLocalSearchParams } from "expo-router";

const OtpSchema = z.object({
  otp: z.string().trim().length(6, { message: "Code must be 6 characters" }),
});

type OtpFormData = z.infer<typeof OtpSchema>;

type Props = {
  email: string;
};

export const OtpForm = ({ email }: Props) => {
  const { control, handleSubmit, clearErrors, setError } = useForm<OtpFormData>(
    {
      resolver: zodResolver(OtpSchema),
      mode: "onSubmit",
      reValidateMode: "onSubmit",
      defaultValues: {
        otp: "",
      },
    },
  );

  const { trigger: triggerVerifyOtp, isMutating: isMutatingVerifyOtp } =
    useVerifyOtp();
  const { trigger: triggerRequestOtp, isMutating: isMutatingRequestOtp } =
    useRequestOtp();
  const { returnTo } = useLocalSearchParams<{ returnTo?: string }>();
  const { dismissScreen } = useDismissScreen({ returnTo });
  const { auth } = useAnalytics();

  const onSubmit = handleSubmit(async (formData: OtpFormData) => {
    try {
      const data = await triggerVerifyOtp({ ...formData, email });
      auth.trackLogin({ isNewUser: data.isNewUser });
      dismissScreen();
      Toast.show({
        type: "success",
        text1: "Welcome to Meowie!",
      });
    } catch (error) {
      setError("otp", { message: (error as Error).message });
    }
  });

  return (
    <View className={"flex w-full flex-1 flex-col justify-between gap-4"}>
      <View className={"flex flex-col gap-4"}>
        <TextInput
          name={"otp"}
          control={control}
          clearErrors={clearErrors}
          title={"Verification code"}
          placeholder={"Enter the code"}
          keyboardType={"number-pad"}
          autoCapitalize={"none"}
          autoCorrect={false}
          maskInReplay
          textContentType={"oneTimeCode"}
          autoComplete={"one-time-code"}
          autoFocus
        />
        <ResendCode
          onPress={() => {
            auth.trackOtpResent();
            return triggerRequestOtp({ email });
          }}
        />
      </View>
      <Button
        variant={"white"}
        size={"lg"}
        onPress={onSubmit}
        isLoading={isMutatingVerifyOtp || isMutatingRequestOtp}
      >
        Submit code
      </Button>
    </View>
  );
};
