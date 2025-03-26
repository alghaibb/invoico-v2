import { cookies } from "next/headers";
import prisma from "@/lib/prisma";

export async function getSession() {
  try {
    const cookieStore = await cookies(); 

    const possibleTokens = [
      "authjs.session-token",
      "next-auth.session-token", 
      process.env.NODE_ENV === "production"
        ? "__Secure-authjs.session-token"
        : "authjs.session-token",
    ];

    let sessionToken = null;

    for (const tokenName of possibleTokens) {
      const cookie = cookieStore.get(tokenName); 
      console.log(`Checking cookie for token: ${tokenName}`, cookie); 
      if (cookie) {
        sessionToken = cookie.value;
        break;
      }
    }

    if (!sessionToken) {
      console.warn("❌ No valid session token found in cookies.");
      return null;
    }

    console.log("✅ Session token found:", sessionToken);

    const session = await prisma.session.findUnique({
      where: { sessionToken },
      include: { user: true },
    });

    if (!session) {
      console.warn("❌ No session found in the database.");
      return null;
    }

    if (new Date(session.expires) < new Date()) {
      console.warn("❌ Session has expired.");
      return null;
    }

    console.log("✅ Valid session retrieved:", session);

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
