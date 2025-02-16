import SignInPage from "./SignInPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In",
};

export default function Page() {
  return <SignInPage />;
}
