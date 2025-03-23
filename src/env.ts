import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().url().min(1),
    AUTH_SECRET: z.string().min(1),
    GOOGLE_CLIENT_ID: z.string().min(1),
    GOOGLE_CLIENT_SECRET: z.string().min(1),
    FACEBOOK_CLIENT_ID: z.string().min(1),
    FACEBOOK_CLIENT_SECRET: z.string().min(1),
    RESEND_API_KEY: z.string().min(1),
    STRIPE_SECRET_KEY: z.string().min(1),
  },
  client: {
    NEXT_PUBLIC_BASE_URL: z.string().min(1).url(),
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().min(1),
    NEXT_PUBLIC_STRIPE_PRICE_ID_PROFESSIONAL_MONTHLY: z.string().min(1),
    NEXT_PUBLIC_STRIPE_PRICE_ID_BUSINESS_MONTHLY: z.string().min(1),
  },
  experimental__runtimeEnv: {
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    NEXT_PUBLIC_STRIPE_PRICE_ID_PROFESSIONAL_MONTHLY: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_PROFESSIONAL_MONTHLY,
    NEXT_PUBLIC_STRIPE_PRICE_ID_BUSINESS_MONTHLY: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_BUSINESS_MONTHLY,
  }
})