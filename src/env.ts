import { z } from "zod";
import { createEnv } from "@t3-oss/env-nextjs";

const booleanString = z.enum(["true", "false"]).transform((val) => val === "true");

export const env = createEnv({
  server: {
    BETTER_AUTH_URL: z.string().url(),
    DATABASE_URL: z.string().url(),
    GOOGLE_CLIENT_ID: z.string().min(1),
    GOOGLE_CLIENT_SECRET: z.string().min(1),
    NODE_ENV: z.enum(["development", "production", "test"]),
    BETTER_AUTH_SECRET: z.string().min(1),
    OPENPANEL_SECRET_KEY: z.string().optional(),
    SMTP_HOST: z.string().optional(),
    SMTP_PORT: z.coerce.number().positive().optional(),
    SMTP_USER: z.string().optional(),
    SMTP_PASS: z.string().optional(),
    SMTP_FROM: z.string().optional(),
    SMTP_SECURE: booleanString.default("false"),
  },
  client: {
    NEXT_PUBLIC_OPENPANEL_CLIENT_ID: z.string().optional(),
    NEXT_PUBLIC_APP_URL: z.string().url(),
  },
  experimental__runtimeEnv: {
    NEXT_PUBLIC_OPENPANEL_CLIENT_ID: process.env.NEXT_PUBLIC_OPENPANEL_CLIENT_ID,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  },
});
