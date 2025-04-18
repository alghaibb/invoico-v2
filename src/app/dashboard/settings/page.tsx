import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Separator } from "@/components/ui/separator";
import { getSession } from "@/utils/session";
import { Metadata } from "next";
import { Suspense } from "react";
import BillingSection from "./_components/BillingSection";
import ChangePasswordForm from "./forms/ChangePasswordForm";

export const dynamic = "force-dynamic";

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

        <Suspense fallback={<LoadingSpinner />}>
          <BillingSection />
        </Suspense>
      </div>
    </div>
  );
}
