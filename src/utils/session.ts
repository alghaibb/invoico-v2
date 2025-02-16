import { cookies } from "next/headers";
import prisma from "@/lib/prisma";

// Function to get session from prisma using session token
export async function getSession() {
  const cookieStore = await cookies();
  const possibleTokens = [
    process.env.NODE_ENV === "production"
      ? "__Secure-authjs.session-token"
      : "next-auth.session-token",
    "authjs.session-token",
  ];

  // Find the first available session token
  let sessionToken;
  for (const tokenName of possibleTokens) {
    const cookie = cookieStore.get(tokenName);
    if (cookie) {
      sessionToken = cookie.value;
      break;
    }
  }

  if (!sessionToken) return null;

  // Get session from Prisma
  const session = await prisma.session.findUnique({
    where: { sessionToken },
    include: { user: true },
  });

  if (!session) return null;

  return {
    ...session,
    expires: session.expires.toISOString(),
  };
}
