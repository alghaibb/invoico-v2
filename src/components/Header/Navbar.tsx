import { User } from "@/types/user";
import Image from "next/image";
import Link from "next/link";
import Logo from "../../../public/logo.png";
import { Button } from "../ui/button";

export default function Navbar({ user }: { user?: User }) {
  return (
    <nav className="flex items-center justify-between p-6 md:p-9">
      <Link href="/">
        <Image src={Logo} alt="Logo" width={100} height={100} />
      </Link>
      <div>
        {user ? (
          <Button asChild>
            <Link href="/dashboard/invoices/create">Create Invoice</Link>
          </Button>
        ) : (
          <div className="flex gap-4">
            <Button asChild variant="outlineSecondary">
              <Link href="/sign-in">Sign In</Link>
            </Button>

            <Button asChild>
              <Link href="/sign-up">Sign Up</Link>
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
}
