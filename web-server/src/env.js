import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    DATABASE_URL: z.string().url(),
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    DEVICE_TOKEN: z.string(),
    MQTT_USERNAME: z.string(),
    MQTT_PASSWORD: z.string(),
    MQTT_CLIENT: z.string(),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    // NEXT_PUBLIC_CLIENTVAR: z.string(),
    NEXT_PUBLIC_MQTT_URL: z.string(),
    NEXT_PUBLIC_MQTT_CLIENT_USERNAME: z.string(),
    NEXT_PUBLIC_MQTT_CLIENT_PASSWORD: z.string(),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV,
    DEVICE_TOKEN: process.env.DEVICE_TOKEN,
    MQTT_USERNAME: process.env.MQTT_USERNAME,
    MQTT_PASSWORD: process.env.MQTT_PASSWORD,
    MQTT_CLIENT: process.env.MQTT_CLIENT,
    // NEXT_PUBLIC_CLIENTVAR: process.env.NEXT_PUBLIC_CLIENTVAR,
    NEXT_PUBLIC_MQTT_URL: process.env.NEXT_PUBLIC_MQTT_URL,
    NEXT_PUBLIC_MQTT_CLIENT_USERNAME:
      process.env.NEXT_PUBLIC_MQTT_CLIENT_USERNAME,
    NEXT_PUBLIC_MQTT_CLIENT_PASSWORD:
      process.env.NEXT_PUBLIC_MQTT_CLIENT_PASSWORD,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
   * useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  /**
   * Makes it so that empty strings are treated as undefined. `SOME_VAR: z.string()` and
   * `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,
});
