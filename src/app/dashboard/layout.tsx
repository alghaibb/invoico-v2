import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { getSession } from "@/utils/session";
import { User2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { signOut } from "../(auth)/(sign-out)/actions";
import logo from "../../../public/logo.png";
import DashboardLinks from "./_components/DashboardLinks";
import MobileSidebar from "./_components/MobileNavigation";
import { getUserSubscription } from "@/utils/get-user-subscription";
import SubscriptionProvider from "@/providers/SubscriptionProvider";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    redirect("/sign-in");
  }

  const userId = session.user.id
  const userSubscription = await getUserSubscription(userId);

  return (
    <SubscriptionProvider userSubscription={userSubscription}>
      <div className="min-h-screen w-full flex flex-col md:grid md:grid-cols-[240px_1fr] lg:grid-cols-[300px_1fr]">
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
                <Button
                  asChild
                  variant="ghost"
                  className=" flex items-center text-sm font-medium text-muted-foreground"
                >
                  <Link href="/"> ← Back to Home</Link>
                </Button>

                <Separator />

                <h1 className="hidden lg:block text-lg lg:text-xl font-semibold mb-4 lg:mb-6 text-left mt-2">
                  <span className="text-primary">{session.user.firstName}</span>
                  , your invoices await. Let&apos;s get started!
                </h1>
                <DashboardLinks />
              </nav>
            </div>
          </div>
        </div>

        <div className="flex flex-col">
          <header className="flex h-16 items-center gap-4 border-b bg-muted/40 px-6 lg:h-[72px] lg:px-8">
            <MobileSidebar firstName={session.user.firstName} />

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
                    <Link href="/dashboard/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/settings">Settings</Link>
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
    </SubscriptionProvider>
  );
}
