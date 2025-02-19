"use client";

import { Button } from "@/components/ui/button";
import { dashboardLinks } from "@/lib/constants";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function DashboardLinks() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col gap-2">
      {dashboardLinks.map((link) => (
        <Button
          asChild
          key={link.id}
          variant="ghost"
          className={cn(
            "items-center gap-3 justify-start transition-all",
            pathname === link.href
              ? "text-foreground bg-muted"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Link
            href={link.href}
            className={cn(pathname === link.href ? "pl-6" : "pl-3")}
          >
            <link.icon className="size-4" />
            {link.name}
          </Link>
        </Button>
      ))}
    </div>
  );
}
