import z from "zod";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const envSchema = z.object({
  EXPO_PUBLIC_BACKEND_URL: z.string(),
  EXPO_PUBLIC_BUILD_ENV: z.enum([
    "local",
    "development",
    "preview",
    "production",
  ]),
  SENTRY_AUTH_TOKEN: z.string(),
  SENTRY_ORG: z.string(),
  SENTRY_PROJECT: z.string(),
  SENTRY_URL: z.string(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ Invalid environment config:", parsed.error.format());
  throw new Error("❌ Invalid environment config");
}

export const env = parsed.data;
