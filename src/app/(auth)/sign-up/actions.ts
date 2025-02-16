"use server"

import prisma from "@/lib/prisma";
import { getUserByEmail } from "@/utils/db/user";
import { sendVerifyAccountEmail } from "@/utils/send-emails";
import { generateVerificationCode } from "@/utils/token";
import { SignUpValues, signUpSchema } from "@/validations/auth";
import bcrypt from "bcryptjs";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { redirect } from "next/navigation";

export async function signUp(values: SignUpValues) {
  try {
    const validatedValues = signUpSchema.parse(values);
    const { firstName, lastName, email, password } = validatedValues;

    const lowercaseEmail = email.toLowerCase();

    const existingUser = await getUserByEmail(lowercaseEmail);
    if (existingUser) {
      return { error: "This email is already in use." };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        firstName,
        lastName,
        email: lowercaseEmail,
        password: hashedPassword,
      },
    });

    const verificationCode = await generateVerificationCode(lowercaseEmail, "sign-up");

    await sendVerifyAccountEmail(lowercaseEmail, verificationCode);
    redirect("/verify-account");
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.error("Error signing up:", error);
    return { error: "An error occurred. Please try again." };
  }
}