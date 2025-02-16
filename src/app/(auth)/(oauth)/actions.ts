"use server"

import { signIn } from "@/auth";
import { env } from "@/env";

export async function facebookLogin() {
  await signIn("facebook", {
    redirect: true,
    redirectTo: `${env.NEXT_PUBLIC_BASE_URL}/dashboard`,
  });
}

export async function googleLogin() {
  await signIn("google", {
    redirect: true,
    redirectTo: `${env.NEXT_PUBLIC_BASE_URL}/dashboard`,
  });
}