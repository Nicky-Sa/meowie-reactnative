import { Text, View } from "react-native";
import { TextInput } from "@/features/common/form/text-input";
import { Mail } from "iconoir-react-native";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "expo-router";
import { Button } from "@/features/common/button";
import { useDeleteAccount } from "@/features/settings/delete-account/data/useDeleteAccount";

type Props = {
  email: string;
  reasonId?: string;
};

const EmailSchema = z.object({
  email: z.string().trim().pipe(z.email().toLowerCase()),
});

type EmailFormData = z.infer<typeof EmailSchema>;

export const EmailForm = ({ email, reasonId }: Props) => {
  const { control, handleSubmit, clearErrors, setError } =
    useForm<EmailFormData>({
      resolver: zodResolver(EmailSchema),
      mode: "onSubmit",
      reValidateMode: "onSubmit",
      defaultValues: {
        email: "",
      },
    });
  const router = useRouter();
  const { trigger, isMutating } = useDeleteAccount();

  const onSubmit = handleSubmit(async (data: EmailFormData) => {
    try {
      await trigger({ ...data, reasonId });
      router.push("/auth/request-otp");
    } catch (error) {
      setError("email", { message: (error as Error).message });
    }
  });

  return (
    <View className={"flex flex-col gap-4"}>
      <Text className={"body-b1 text-neutral-10-default"}>
        To confirm this action, please type your email,{" "}
        <Text className={"body-b1-strong text-neutral-5-default"}>{email}</Text>
        , into the box below.
      </Text>
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
        Delete Account
      </Button>
    </View>
  );
};
