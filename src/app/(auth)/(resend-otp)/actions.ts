"use server"

import prisma from "@/lib/prisma";
import { getUserByEmail } from "@/utils/db/user";
import { sendResendOTPEmail } from "@/utils/send-emails";
import { deleteVerificationOTPByUserId, generateVerificationCode } from "@/utils/token";
import { resendOTPSchema, ResendOTPValues } from "@/validations/auth";

export async function resendOTP(values: ResendOTPValues) {
  try {
    const validatedData = resendOTPSchema.parse(values);
    const { email } = validatedData;

    const lowercaseEmail = email.toLowerCase();

    const user = await getUserByEmail(lowercaseEmail);
    if (!user) {
      return { error: "User not found" };
    }

    const lastOTP = await prisma.verificationOTP.findFirst({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    const cooldownTime = 60 * 1000;
    if (lastOTP && new Date().getTime() - lastOTP.createdAt.getTime() < cooldownTime) {
      const remainingTime = Math.ceil(
        (cooldownTime - (new Date().getTime() - lastOTP.createdAt.getTime())) / 1000
      );
      throw new Error(`Please wait ${remainingTime}s before requesting a new OTP.`);
    }

    await prisma.verificationOTP.deleteMany({
      where: {
        userId: user.id,
        expiresAt: { lte: new Date() }
      }
    });

    await deleteVerificationOTPByUserId(user.id);

    const verificationCode = await generateVerificationCode(user.email, "resend-otp");

    await sendResendOTPEmail(user.email, verificationCode);

    return { success: "OTP sent successfully" };
  } catch (error) {
    console.error("Error resending OTP:", error);
    return { error: "Failed to resend OTP. Please try again later." };

  }
}