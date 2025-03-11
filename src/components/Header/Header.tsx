import { getSession } from "@/utils/session";
import Navbar from "./Navbar";
import { User } from "@/types/user";

export default async function Header() {
  const session = await getSession();
  const user: User | undefined = session?.user
  ? {
      id: session.user.id,
      firstName: session.user.firstName,
      lastName: session.user.lastName ?? undefined, 
      email: session.user.email,
    }
  : undefined;

  return (
    <header className="w-full border-b border-muted">
      <div className="mx-auto w-full max-w-7xl">
        <Navbar user={user} />
      </div>
    </header>
  );
}
