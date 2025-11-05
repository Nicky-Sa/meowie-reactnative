import { KeyboardAvoidingView, Platform, View } from "react-native";
import { TextInput } from "@/features/common/form/text-input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/features/common/button";

const LoginSchema = z.object({
  email: z.email({ message: "Must be a valid email format." }),
});

type LoginFormData = z.infer<typeof LoginSchema>;

export const EmailForm = () => {
  const { control, handleSubmit } = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
    },
  });
  const onSubmit = handleSubmit((data: LoginFormData) => {
    console.log("Form Data:", data);
  });

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
    >
      <View className={"flex w-full flex-col gap-2"}>
        <TextInput
          name={"email"}
          control={control}
          title={"Email"}
          placeholder={"Enter your email"}
          keyboardType={"email-address"}
        />
        <Button variant={"white"} size={"lg"} onPress={onSubmit}>
          Continue with Email
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
};
