import * as AppIntents from "expo-app-intents";

export const SiriListener = () => {
  AppIntents.useAppIntents(async (pendingIntents) => {
    for (const invocation of pendingIntents) {
      if (invocation.name !== "saveMedia") continue;

      console.log("Siri asked to save:", invocation.params.title);
      try {
        await AppIntents.removePendingInvocationAsync(invocation.id);
      } catch (error) {
        console.error("Could not remove the Siri request:", error);
      }
    }
  });

  return null;
};
