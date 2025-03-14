"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import DashboardLinks from "./DashboardLinks";

export default function MobileSidebar({ firstName }: { firstName: string }) {
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  return (
    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="md:hidden">
          <Menu className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 flex flex-col">
        <Link
          href="/"
          className="mb-2 flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
        >
          ← Back to Home
        </Link>

        <Separator className="my-2" />

        <SheetTitle className="text-xl font-semibold text-center">
          <span className="text-primary">{firstName}</span>, your invoices
          await. Let&apos;s get started!
        </SheetTitle>

        <Separator className="my-2" />

        <nav className="grid gap-4 mt-6">
          <DashboardLinks closeSheet={() => setIsSheetOpen(false)} />
        </nav>
      </SheetContent>
    </Sheet>
  );
}
