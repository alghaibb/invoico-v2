import SubscriptionModal from "@/components/subscription/SubscriptionModal.tsx";
import { Toaster } from "@/components/ui/sonner";
import SubscriptionProvider from "@/providers/SubscriptionProvider";
import { getUserSubscription } from "@/utils/get-user-subscription";
import { getSession } from "@/utils/session";
import type { Metadata } from "next";
import "./globals.css";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: {
    template: "%s | Invoico",
    absolute: "Invoico",
  },
  description:
    "Invoico is a robust invoicing platform for freelancers and small businesses.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();
  const userId = session?.user.id as string;

  const userSubscription = await getUserSubscription(userId);

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={"antialiased mx-auto min-h-screen w-full bg-background"}>
        <SubscriptionProvider userSubscription={userSubscription}>
          <main className="flex flex-col min-h-screen">
            <div className="flex-grow">
              {children}
              <SubscriptionModal />
            </div>
          </main>
        </SubscriptionProvider>
        <Toaster richColors closeButton theme="light" />
      </body>
    </html>
  );
}
