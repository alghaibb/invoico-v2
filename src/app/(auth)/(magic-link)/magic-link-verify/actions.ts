"use server";

import { signIn } from "@/auth";
import prisma from "@/lib/prisma";
import { verifyMagicLinkToken } from "@/utils/token";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { redirect } from "next/navigation";

export async function verifyMagicLink(token: string) {
  try {
    const user = await verifyMagicLinkToken(token);

    // Ensure we received a valid user object
    if (!user || "error" in user || !user.email) {
      throw new Error("Invalid or expired magic link.");
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { emailVerified: new Date() },
    });

    await signIn("credentials", {
      email: user.email,
      redirect: true,
    });

    redirect("/dashboard");
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.error("Error verifying magic link:", error);
    return { error: "An error occurred. Please try again." };
  }
}
