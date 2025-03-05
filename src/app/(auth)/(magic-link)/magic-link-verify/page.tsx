import { Metadata } from "next";
import { Suspense } from "react";
import VerifyMagicLinkPage from "./VerifyMagicLinkPage";

export const metadata: Metadata = {
  title: "Verify Magic Link",
};

export default function Page() {
  return (
    <Suspense fallback={<p>loading...</p>}>
      <VerifyMagicLinkPage />
    </Suspense>
  );
}
