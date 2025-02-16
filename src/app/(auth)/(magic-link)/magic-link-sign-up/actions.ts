"use server";

import prisma from "@/lib/prisma";
import { getUserByEmail } from "@/utils/db/user";
import { sendMagicLinkEmail } from "@/utils/send-emails";
import { generateMagicLinkToken } from "@/utils/token";
import { MagicLinkSignUpValues, magicLinkSignUpSchema } from "@/validations/auth";

export async function magicLinkSignUp(values: MagicLinkSignUpValues) {
  try {
    const validatedValues = magicLinkSignUpSchema.parse(values);
    const { firstName, lastName, email } = validatedValues;

    const lowercaseEmail = email.toLowerCase();

    const existingUser = await getUserByEmail(lowercaseEmail);
    if (existingUser) {
      return { error: "This email is already in use." };
    }

    await prisma.user.create({
      data: {
        firstName,
        lastName,
        email: lowercaseEmail,
      },
    });

    // Generate a magic link token
    const magicLinkToken = await generateMagicLinkToken(lowercaseEmail);

    // Send magic link via email
    await sendMagicLinkEmail(lowercaseEmail, magicLinkToken);

    return { success: "Check your email for a magic link to complete sign-up." };
  } catch (error) {
    console.error("Error in Magic Link Sign-Up:", error);
    return { error: "An error occurred. Please try again." };
  }
}
