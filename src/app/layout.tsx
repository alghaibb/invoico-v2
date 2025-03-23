import { Toaster } from "@/components/ui/sonner";
import type { Metadata } from "next";
import "./globals.css";
import SubscriptionModal from "@/components/subscription/SubscriptionModal.tsx";

export const metadata: Metadata = {
  title: {
    template: "%s | Invoico",
    absolute: "Invoico",
  },
  description:
    "Invoico is a robust invoicing platform for freelancers and small businesses.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={"antialiased mx-auto min-h-screen w-full bg-background"}>
        <main className="flex flex-col min-h-screen">
          <div className="flex-grow">
            {children}
            <SubscriptionModal />
          </div>
        </main>
        <Toaster richColors closeButton theme="light" />
      </body>
    </html>
  );
}
