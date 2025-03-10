import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getSession } from "@/utils/session";
import { User2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { signOut } from "../(auth)/(sign-out)/actions";
import logo from "../../../public/logo.png";
import DashboardLinks from "./_components/DashboardLinks";
import MobileSidebar from "./_components/MobileNavigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    redirect("/sign-in");
  }

  return (
    <>
      <div className="min-h-screen w-full flex flex-col md:grid md:grid-cols-[240px_1fr] lg:grid-cols-[300px_1fr]">
        {/* Sidebar */}
        <div className="hidden border-r bg-muted/40 md:block">
          <div className="flex flex-col h-full max-h-screen gap-4">
            <div className="h-16 flex items-center border-b px-6 lg:h-[72px] lg:px-8">
              <Link href="/" className="flex items-center gap-3">
                <Image
                  src={logo}
                  alt="logo"
                  width={140}
                  height={140}
                  className="h-12 w-auto lg:h-14"
                />
              </Link>
            </div>

            <div className="flex-1">
              <nav className="grid items-start px-4 text-sm font-medium lg:px-6">
                <DashboardLinks />
              </nav>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col">
          <header className="flex h-16 items-center gap-4 border-b bg-muted/40 px-6 lg:h-[72px] lg:px-8">
            <MobileSidebar firstName={session.user.firstName} />

            {/* User Dropdown */}
            <div className="flex items-center ml-auto">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="rounded-full"
                    size="icon"
                  >
                    <User2 className="size-6" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/invoices">Invoices</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <button className="w-full text-left" onClick={signOut}>
                      Sign Out
                    </button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          <main className="flex flex-col flex-1 gap-6 p-6 lg:gap-8 lg:p-10">
            {children}
          </main>
        </div>
      </div>
    </>
  );
}
