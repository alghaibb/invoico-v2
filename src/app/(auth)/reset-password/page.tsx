import ResetPasswordPage from "./ResetPasswordPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reset Password",
};

export default function Page() {
  return <ResetPasswordPage />;
}
