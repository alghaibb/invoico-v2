import { Metadata } from "next";
import VerifyMagicLinkPage from "./VerifyMagicLinkPage";

export const metadata: Metadata = {
  title: "Verify Magic Link",
};

export default function Page() {
  return <VerifyMagicLinkPage />;
}
