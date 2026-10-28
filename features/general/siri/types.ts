import * as AppIntents from "expo-app-intents";

export type SiriParams = AppIntents.AppIntentInvocation["params"];

export const SIRI_COMMANDS = ["saveMedia", "searchMedia"] as const;

export type SiriCommand = (typeof SIRI_COMMANDS)[number];

export const isSiriCommand = (name: string): name is SiriCommand =>
  SIRI_COMMANDS.some((command) => command === name);
