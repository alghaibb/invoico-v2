import SubscriptionModal from "@/components/subscription/SubscriptionModal.tsx";
import { Toaster } from "@/components/ui/sonner";
import ReactQueryProvider from "@/providers/ReactQueryProvider";
import type { Metadata } from "next";
import "./globals.css";

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
        <ReactQueryProvider>
          <main className="flex flex-col min-h-screen">
            <div className="flex-grow">
              {children}
              <SubscriptionModal />
            </div>
          </main>
        </ReactQueryProvider>

        <Toaster richColors closeButton theme="light" />
      </body>
    </html>
  );
}
