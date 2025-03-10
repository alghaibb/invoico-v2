"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import DashboardLinks from "./DashboardLinks";
import { Separator } from "@/components/ui/separator";

export default function MobileSidebar({ firstName }: { firstName: string }) {
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  return (
    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="md:hidden">
          <Menu className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64">
        <SheetTitle className="text-xl font-semibold text-center">
          Hello {firstName}
        </SheetTitle>
        <Separator className="my-1" />
        <nav className="grid gap-4 mt-10">
          <DashboardLinks closeSheet={() => setIsSheetOpen(false)} />
        </nav>
      </SheetContent>
    </Sheet>
  );
}
