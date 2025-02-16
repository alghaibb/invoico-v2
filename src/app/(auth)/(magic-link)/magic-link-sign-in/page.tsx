import { Metadata } from "next";
import MagicLinkSignInPage from "./MagicLinkSignInPage";

export const metadata: Metadata = {
  title: "Magic Link Sign In",
};

export default function Page() {
  return <MagicLinkSignInPage />;
}
