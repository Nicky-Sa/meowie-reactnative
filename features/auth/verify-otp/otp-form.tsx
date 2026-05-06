import { View } from "react-native";
import { TextInput } from "@/features/common/form/text-input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/features/common/ui/button";
import { useVerifyOtp } from "@/features/auth/verify-otp/data/useVerifyOtp";
import { useRequestOtp } from "@/features/auth/request-otp/data/useRequestOtp";
import { ResendCode } from "@/features/auth/verify-otp/resend-code";
import { useDismissScreen } from "@/features/auth/use-dismiss-screen";
import { useAnalytics } from "@/features/general/posthog/hook/use-analytics";

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
  const { dismissScreen } = useDismissScreen();
  const { auth } = useAnalytics();

  const onSubmit = handleSubmit(async (data: OtpFormData) => {
    try {
      const response = await triggerVerifyOtp({ ...data, email });
      auth.trackLogin({ isNewUser: response.data.isNewUser });
      dismissScreen();
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
        />
        <ResendCode onPress={() => triggerRequestOtp({ email })} />
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
