import { Metadata } from "next";
import MagicLinkSignUpPage from "./MagicLinkSignUpPage";

export const metadata: Metadata = {
  title: "Magic Link Sign Up",
};

export default function Page() {
  return <MagicLinkSignUpPage />;
}
