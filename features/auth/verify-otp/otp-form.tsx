import { KeyboardAvoidingView, Platform, View } from "react-native";
import { TextInput } from "@/features/common/form/text-input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/features/common/button";
import { useRouter } from "expo-router";
import { useVerifyOtp } from "@/features/auth/verify-otp/data/useVerifyOtp";
import { useRequestOtp } from "@/features/auth/request-otp/data/useRequestOtp";
import { ResendCode } from "@/features/auth/verify-otp/resend-code";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
  const router = useRouter();

  const onSubmit = handleSubmit(async (data: OtpFormData) => {
    try {
      const response = await triggerVerifyOtp({ ...data, email });
      if (!response.data.isValid) {
        setError("otp", { message: "Invalid code" });
        return;
      }
      AsyncStorage.setItem("logged-in", "true").then(() =>
        router.replace("/(tabs)/movies"),
      );
    } catch (error) {
      setError("otp", { message: (error as Error).message });
    }
  });

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      className={"flex-1"}
    >
      <View className={"flex h-full w-full flex-col justify-between gap-4"}>
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
    </KeyboardAvoidingView>
  );
};
