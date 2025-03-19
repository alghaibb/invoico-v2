"use server"

import prisma from "@/lib/prisma";
import { getSession } from "@/utils/session";
import { updateUserSchema, UpdateUserValues } from "@/validations/user-schema";
import { revalidatePath } from "next/cache";

export async function updateUserProfile(values: UpdateUserValues) {
  try {
    const session = await getSession();
    const user = session?.user.id;

    if (!user) {
      throw new Error("User not found");
    }

    const currentUser = await prisma.user.findUnique({
      where: { id: user },
      select: { firstName: true, lastName: true },
    });

    if (!currentUser) {
      throw new Error("User does not exist");
    }

    const validatedValues = updateUserSchema.parse(values);

    if (!validatedValues) {
      throw new Error("Invalid values");
    }

    const isSameAsCurrent =
      validatedValues.firstName === currentUser.firstName &&
      validatedValues.lastName === currentUser.lastName;

    if (isSameAsCurrent) {
      throw new Error("No changes detected");
    }

    await prisma.user.update({
      where: { id: user },
      data: {
        firstName: validatedValues.firstName,
        lastName: validatedValues.lastName
      }
    });

    revalidatePath("/dashboard/profile", "page");

    return { success: "Profile updated successfully!" };

  } catch (error) {
    console.error(error);
    return { error: "An error occurred while updating the profile details" };
  }
}