import SignOutButton from "@/app/(auth)/(sign-out)/_components/SignOutButton";
import { navbarLinks } from "@/lib/constants";
import { User } from "@/types/user";
import Image from "next/image";
import Link from "next/link";
import Logo from "../../../public/logo.png";
import { Button } from "../ui/button";
import MobileNav from "./MobileNav";

export default function Navbar({ user }: { user?: User }) {
  return (
    <nav className="flex items-center justify-between p-6 md:p-9">
      <Link href="/">
        <Image src={Logo} alt="Logo" width={100} height={100} />
      </Link>

      <div className="md:flex gap-4 hidden">
        {navbarLinks.map((link) => (
          <Button
            asChild
            key={link.id}
            variant="linkHover2"
            className="text-foreground"
          >
            <Link href={link.href}>{link.name}</Link>
          </Button>
        ))}
      </div>

      <MobileNav user={user} />

      <div className="md:flex hidden">
        {user ? (
          <div className="flex gap-4 items-center">
            <Button asChild variant="outlineSecondary">
              <Link href="/dashboard/invoices">View Your Invoices</Link>
            </Button>

            <SignOutButton />
          </div>
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
