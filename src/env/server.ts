import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";
import { config } from "dotenv";
import { expand } from "dotenv-expand";

expand(config());

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(["development", "production"]),
    GOOGLE_CLIENT_ID: z.string(),
    GOOGLE_CLIENT_SECRET: z.string(),
    NEXTAUTH_URL: z.string().url(),
    NEXTAUTH_SECRET: z.string(),
    DB_URL: z.string().url(),
  },
  onValidationError: (issues) => {
    console.error(
      "❌ Invalid environment variables:",
      issues
    );
    process.exit(1);
  },
  emptyStringAsUndefined: true,
  experimental__runtimeEnv: process.env,
});
