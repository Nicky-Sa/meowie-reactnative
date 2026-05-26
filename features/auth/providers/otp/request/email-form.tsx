import { View } from "react-native";
import { TextInput } from "@/features/common/form/text-input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/features/common/ui/button";
import { Mail } from "iconoir-react-native";
import { useRequestOtp } from "@/features/auth/providers/otp/request/data/useRequestOtp";
import { useRouter } from "expo-router";
import { useAnalytics } from "@/features/general/posthog/hook/use-analytics";

const LoginSchema = z.object({
  email: z.string().trim().pipe(z.email().toLowerCase()),
});

type LoginFormData = z.infer<typeof LoginSchema>;

export const EmailForm = () => {
  const { control, handleSubmit, clearErrors, setError } =
    useForm<LoginFormData>({
      resolver: zodResolver(LoginSchema),
      mode: "onSubmit",
      reValidateMode: "onSubmit",
      defaultValues: {
        email: "",
      },
    });
  const { trigger, isMutating } = useRequestOtp();
  const router = useRouter();
  const { auth } = useAnalytics();

  const onSubmit = handleSubmit(async (data: LoginFormData) => {
    try {
      auth.trackOtpRequested();
      await trigger(data);
      router.push({
        pathname: "/auth/otp/verify",
        params: { ...data },
      });
    } catch (error) {
      setError("email", { message: (error as Error).message });
    }
  });

  return (
    <View className={"flex flex-1 flex-col justify-between gap-4"}>
      <TextInput
        name={"email"}
        control={control}
        clearErrors={clearErrors}
        title={"Email"}
        placeholder={"Enter your email"}
        keyboardType={"email-address"}
        autoCapitalize={"none"}
        autoCorrect={false}
        icon={Mail}
        maskInReplay
        textContentType={"emailAddress"}
        autoComplete={"email"}
        autoFocus
      />
      <Button
        variant={"white"}
        size={"lg"}
        onPress={onSubmit}
        isLoading={isMutating}
      >
        Next
      </Button>
    </View>
  );
};
