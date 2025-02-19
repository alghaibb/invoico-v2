import { cookies } from "next/headers";
import prisma from "@/lib/prisma";

export async function getSession() {
  try {
    const cookieStore = cookies();
    const possibleTokens = [
      "authjs.session-token",
      "next-auth.session-token", 
      process.env.NODE_ENV === "production"
        ? "__Secure-authjs.session-token"
        : "authjs.session-token",
    ];

    let sessionToken = null;
    for (const tokenName of possibleTokens) {
      const cookie = (await cookieStore).get(tokenName);
      if (cookie) {
        sessionToken = cookie.value;
        break;
      }
    }

    if (!sessionToken) {
      return null;
    }

    // Fetch session from Prisma
    const session = await prisma.session.findUnique({
      where: { sessionToken },
      include: { user: true },
    });

    if (!session) {
      return null;
    }

    // Check if session is expired
    if (new Date(session.expires) < new Date()) {
      return null;
    }

    return {
      ...session,
      user: {
        id: session.user.id,
        email: session.user.email,
        firstName: session.user.firstName,
        lastName: session.user.lastName,
      },
      expires: session.expires.toISOString(),
    };
  } catch (error) {
    console.error("❌ Error fetching session:", error);
    return null;
  }
}
