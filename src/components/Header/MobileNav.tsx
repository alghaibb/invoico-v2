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
import { Separator } from "../ui/separator";

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
          <div className="mt-4">
            <p className="font-medium text-center text-xl">
              Welcome, {user ? user.firstName : "Guest"}!
            </p>
          </div>

          <Separator className="my-1" />

          <nav className="flex flex-col">
            {navbarLinks.map((link) => (
              <SheetClose key={link.id} asChild>
                <Link
                  href={link.href}
                  className="px-4 py-3 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                >
                  {link.name}
                  <Separator className="my-2" />
                </Link>
              </SheetClose>
            ))}
          </nav>

          <div className="flex flex-col gap-4 mt-auto border-t border-muted pt-6">
            {user ? (
              <>
                <SheetClose asChild>
                  <Button asChild variant="outlineSecondary">
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
