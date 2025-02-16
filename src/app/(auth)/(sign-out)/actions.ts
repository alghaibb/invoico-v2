"use server";

import { getSession } from "@/utils/session";
import { signOut as authSignOut} from "@/auth";

export async function signOut() {
  const session = getSession();

  if (!session) {
    throw new Error("Unauthorized");
  }

  await authSignOut({ redirect: true, redirectTo: "/sign-in" });
}