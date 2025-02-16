"use server";

import { getUserByEmail } from "@/utils/db/user";
import { sendMagicLinkEmail } from "@/utils/send-emails";
import { generateMagicLinkToken } from "@/utils/token";
import { MagicLinkSignInValues, magicLinkSignInSchema } from "@/validations/auth";

export async function magicLinkSignIn(values: MagicLinkSignInValues) {
  try {
    const validatedValues = magicLinkSignInSchema.parse(values);
    const { email } = validatedValues;

    const lowercaseEmail = email.toLowerCase();

    const user = await getUserByEmail(lowercaseEmail);
    
    if (!user) {
      return { error: "User not found. Please sign up first." };
    }

    // Generate a magic link token
    const magicLinkToken = await generateMagicLinkToken(lowercaseEmail);

    // Send magic link via email
    await sendMagicLinkEmail(lowercaseEmail, magicLinkToken);
    return { success: "Check your email for a magic link to sign in." };
  } catch (error) {
    console.error("Error in Magic Link Sign-In:", error);
    return { error: "An error occurred. Please try again." };
  }
}
