import { usePostHog, Survey } from "posthog-react-native";
import { useQuery } from "@tanstack/react-query";

export const SURVEY_ID = "019d872d-0140-0000-355a-81dd8beab75e";

export const useFetchFeedbackSurvey = () => {
  const posthog = usePostHog();

  return useQuery<Survey | null>({
    queryKey: ["posthog-survey", SURVEY_ID],
    queryFn: async () => {
      const surveys = await posthog.getSurveys();
      const targetSurvey = surveys.find((s) => s.id === SURVEY_ID);
      return targetSurvey ?? null;
    },
    enabled: !!posthog,
  });
};
