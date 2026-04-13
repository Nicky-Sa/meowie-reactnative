import { View, Text, ScrollView } from "react-native";
import { InnerScreen } from "@/features/common/layout/inner-screen";
import { Button } from "@/features/common/ui/button";
import { TextInput } from "@/features/common/form/text-input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { usePostHog } from "posthog-react-native";
import { useFetchFeedbackSurvey } from "@/features/settings/feedback/data/useFetchFeedbackSurvey";
import Toast from "react-native-toast-message";
import { useRouter } from "expo-router";
import { KeyboardAvoidingWrapper } from "@/features/common/layout/keyboard-avoiding-wrapper";

export const QUESTION_FEEDBACK_ID = "421566ba-5109-493f-a37a-62849fc4c465";
export const QUESTION_S3_URL_ID = "9aee8e1c-66ff-4406-aa77-f816adb1459e";

const FeedbackSchema = z.object({
  feedback: z.string().min(1, "Please enter your feedback"),
  s3Url: z.string().or(z.null()),
});

type FeedbackFormValues = z.infer<typeof FeedbackSchema>;

export const Screen = () => {
  const posthog = usePostHog();
  const router = useRouter();

  const {
    control,
    handleSubmit,
    clearErrors,
    formState: { isSubmitting, isValid },
  } = useForm<FeedbackFormValues>({
    resolver: zodResolver(FeedbackSchema),
    defaultValues: {
      feedback: "",
      s3Url: null,
    },
    mode: "onChange",
  });

  const { data: survey } = useFetchFeedbackSurvey();

  const onSubmit = handleSubmit(async (data: FeedbackFormValues) => {
    if (!survey) {
      Toast.show({ type: "error", text1: "Survey not initialized" });
      return;
    }

    // Submit the survey response to PostHog using the exact property format PostHog uses to aggregate responses in the Survey dashboard
    // "survey sent" is a special event
    posthog.capture("survey sent", {
      $survey_id: survey.id,
      $survey_name: survey.name,
      $survey_response: {
        [QUESTION_FEEDBACK_ID]: data.feedback,
        [QUESTION_S3_URL_ID]: data.s3Url,
      },
    });

    Toast.show({
      type: "success",
      text1: "Thanks for your feedback! 🍿",
    });

    router.back();
  });

  return (
    <KeyboardAvoidingWrapper>
      <InnerScreen title="Send Feedback">
        <ScrollView
          contentContainerClassName={
            "flex w-full flex-col items-center gap-8 pb-4 flex-1 justify-between"
          }
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View className="flex flex-col gap-6">
            <Text className="body-b1 text-neutral-10-default">
              Have an idea or spotted a bug? We&#39;d love to hear from you to
              make your swiping experience seamless.
            </Text>

            <View className="flex flex-col gap-2">
              <TextInput
                isTextArea
                name="feedback"
                control={control}
                clearErrors={clearErrors}
                title="Feedback"
                placeholder="Write your feedback here"
                multiline
              />
            </View>
          </View>
        </ScrollView>
        <Button
          variant={"white"}
          size="lg"
          onPress={onSubmit}
          isLoading={isSubmitting}
          disabled={!isValid}
        >
          Send
        </Button>
      </InnerScreen>
    </KeyboardAvoidingWrapper>
  );
};
