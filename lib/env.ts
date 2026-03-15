import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

/*
Only for app needed variables. There are some more build variables in app.config.ts
 */
export const env = createEnv({
  /*
   * Client-side variables (exposed to the app)
   */
  clientPrefix: "EXPO_PUBLIC_",

  client: {
    EXPO_PUBLIC_BACKEND_URL: z.url("EXPO_PUBLIC_BACKEND_URL is required"),
    EXPO_PUBLIC_APP_VARIANT: z
      .enum(
        ["development", "preview", "production"],
        "EXPO_PUBLIC_APP_VARIANT is required",
      )
      .default("development"),
    EXPO_PUBLIC_SENTRY_RELEASE: z.string().optional(),
  },

  /*
   * Shared variables (they don't have a prefix)
   */
  shared: {},

  /*
   * DUE TO REACT NATIVE / METRO LIMITATIONS:
   * You must manually destructure process.env here.
   * If you don't do this, the variables won't be replaced at build time.
   */
  runtimeEnv: {
    EXPO_PUBLIC_APP_VARIANT: process.env.EXPO_PUBLIC_APP_VARIANT,
    EXPO_PUBLIC_BACKEND_URL: process.env.EXPO_PUBLIC_BACKEND_URL,
    EXPO_PUBLIC_SENTRY_RELEASE: process.env.EXPO_PUBLIC_SENTRY_RELEASE,
  },

  skipValidation: !!process.env.SKIP_ENV_VALIDATION,

  emptyStringAsUndefined: true,
});
