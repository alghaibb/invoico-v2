import { getSession } from "@/utils/session";
import { redirect } from "next/navigation";
import ProfileForm from "./ProfileForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile",
};

export default async function Page() {
  const session = await getSession();

  if (!session?.user.id) {
    redirect("/sign-in");
  }

  return (
    <div className="flex flex-col items-center justify-center px-4">
      <h1 className="text-3xl font-semibold text-center mb-2">Profile</h1>
      <p className="text-muted-foreground text-center mb-6">
        Update your profile details below.
      </p>
      <ProfileForm
        firstName={session.user.firstName}
        lastName={session.user.lastName ?? ""}
        email={session.user.email}
      />
    </div>
  );
}
