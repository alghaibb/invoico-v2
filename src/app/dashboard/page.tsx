import { getSession } from "@/utils/session";
import { redirect } from "next/navigation";
import SignOutButton from "../(auth)/(sign-out)/_components/SignOutButton";

export default async function Page() {
  const session = await getSession();

  if (!session) {
    redirect("/sign-in");
  }

  return (
    <div>
      dashboard page
      <SignOutButton />
    </div>
  );
}
