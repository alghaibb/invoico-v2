import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Dashboard page",
};

export default async function Page() {
  return <div>hello from dashboard</div>;
}
