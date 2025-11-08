import { KeyboardAvoidingView, Platform, View } from "react-native";
import { TextInput } from "@/features/common/form/text-input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/features/common/button";
import { Mail } from "iconoir-react-native";
import { useRequestOtp } from "@/features/auth/request-otp/data/useRequestOtp";
import { useRouter } from "expo-router";

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

  const onSubmit = handleSubmit(async (data: LoginFormData) => {
    try {
      await trigger(data);
      router.push("/auth/verify-otp");
    } catch (error) {
      console.log({ error });
      setError("email", { message: (error as Error).message });
    }
  });

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <View className={"flex w-full flex-col gap-4"}>
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
        />
        <Button
          variant={"white"}
          size={"lg"}
          onPress={onSubmit}
          isLoading={isMutating}
        >
          Continue with Email
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
};
