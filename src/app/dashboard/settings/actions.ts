"use server";

import prisma from "@/lib/prisma";
import { getSession } from "@/utils/session";
import { changePasswordSchema, ChangePasswordValues } from "@/validations/user/change-password-schema";
import bcrypt from "bcryptjs";

export async function changePassword(values: ChangePasswordValues, userId: string) {
  try {
    const validatedData = changePasswordSchema.parse(values);

    const session = await getSession();
    if (!session?.user || session.user.id !== userId) {
      throw new Error("Unauthorized");
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.password) {
      throw new Error("User not found");
    }

    const isPasswordValid = await bcrypt.compare(validatedData.oldPassword, user.password);
    if (!isPasswordValid) {
      return { error: "Current password is incorrect." };
    }

    const hashedNewPassword = await bcrypt.hash(validatedData.newPassword, 10);

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedNewPassword },
    });
    return { success: "Password updated successfully!" };
  } catch (error) {
    console.error(error);
    return { error: "An error occurred while updating the password." };
  }
}
