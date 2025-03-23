import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { getSession } from "@/utils/session";
import { Metadata } from "next";
import { Suspense } from "react";
import BillingSection from "./_components/BillingSection";
import ChangePasswordForm from "./forms/ChangePasswordForm";

export const metadata: Metadata = {
  title: "Settings",
};

export default async function Page() {
  const session = await getSession();
  const userId = session?.user.id as string;

  return (
    <div className="flex flex-col items-center justify-center w-full py-10 px-4">
      <div className="w-full max-w-7xl space-y-6">
        <h1 className="text-4xl font-bold mb-6 text-center">Settings</h1>

        <section className="space-y-6">
          <ChangePasswordForm userId={userId} />
        </section>

        <Separator />

        <Suspense fallback={<Skeleton className="w-full h-full" />}>
          <BillingSection />
        </Suspense>
      </div>
    </div>
  );
}
