"use server"

import bcrypt from "bcryptjs";
import { SignInValues, signInSchema } from "@/validations/auth";
import { redirect } from "next/navigation";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { getUserByEmail } from "@/utils/db/user";
import { signIn as authSignIn } from "@/auth";

export async function signIn(values: SignInValues) {
  try {
    const validatedValues = signInSchema.parse(values);
    const { email, password } = validatedValues;

    const lowercaseEmail = email.toLowerCase();

    const user = await getUserByEmail(lowercaseEmail);
    if (!user || !user.password) {
      return { error: "Invalid email or password." };
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password as string);

    if (!isPasswordCorrect) {
      return { error: "Invalid email or password." };
    }

    await authSignIn("credentials", {
      email: lowercaseEmail,
      password,
      redirect: false,
    });

    redirect("/dashboard");

  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.error("Error signing in:", error);
    return { error: "An error occurred. Please try again." };
  }
}