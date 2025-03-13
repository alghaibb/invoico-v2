"use client";

import SignOutButton from "@/app/(auth)/(sign-out)/_components/SignOutButton";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { navbarLinks } from "@/lib/constants";
import { User } from "@/types/user";
import { Menu } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";

export default function MobileNav({ user }: { user?: User }) {
  return (
    <div className="md:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <Menu className="h-6 w-6" />
            <SheetTitle className="sr-only">Open mobile navigation</SheetTitle>
          </Button>
        </SheetTrigger>

        <SheetContent
          side="left"
          className="w-3/4 sm:max-w-sm flex flex-col justify-between h-full"
        >
          <div className="py-6">
            <p className="font-medium text-center underline underline-offset-4 text-xl">
              Welcome, {user ? user.firstName : "Guest"}!
            </p>
          </div>

          <nav className="space-y-2 flex flex-col gap-2">
            {navbarLinks.map((link) => (
              <SheetClose key={link.id} asChild>
                <Button variant="outline" asChild>
                  <Link href={link.href}>{link.name}</Link>
                </Button>
              </SheetClose>
            ))}
          </nav>

          <div className="flex flex-col gap-4 mt-auto border-t border-muted pt-6">
            {user ? (
              <>
                <SheetClose asChild>
                  <Button asChild>
                    <Link href="/dashboard/invoices/create">
                      Create Invoice
                    </Link>
                  </Button>
                </SheetClose>
                <SheetClose asChild>
                  <SignOutButton className="w-full" />
                </SheetClose>
              </>
            ) : (
              <>
                <SheetClose asChild>
                  <Button asChild variant="outlineSecondary">
                    <Link href="/sign-in">Sign In</Link>
                  </Button>
                </SheetClose>
                <SheetClose asChild>
                  <Button asChild>
                    <Link href="/sign-up">Sign Up</Link>
                  </Button>
                </SheetClose>
              </>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
