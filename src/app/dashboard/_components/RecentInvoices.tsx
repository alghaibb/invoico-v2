import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import prisma from "@/lib/prisma";
import { Currency } from "@/types/currency";
import { formatCurrency } from "@/utils/format-currency";
import { getSession } from "@/utils/session";
import ClipboardCopyButton from "./ClipboardCopyButton";

async function getData(userId: string) {
  const data = await prisma.invoice.findMany({
    where: { userId },
    select: {
      id: true,
      clientName: true,
      clientEmail: true,
      total: true,
      currency: true,
    },
    orderBy: { createdAt: "desc" },
    take: 7,
  });

  return data.map((invoice) => ({
    ...invoice,
    total: Number(invoice.total),
  }));
}

export default async function RecentInvoices() {
  const session = await getSession();
  const user = session?.user.id as string;

  const data = await getData(user);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Invoices</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-8">
        {data.map((item) => {
          const hasEmail =
            !!item.clientEmail && item.clientEmail !== "No email";

          return (
            <div key={item.id} className="flex items-center gap-4 group">
              <Avatar className="size-9">
                <AvatarFallback>
                  {(() => {
                    const words = item.clientName.split(" - ")[0].split(/\s+/);
                    const firstLetter = words[0]?.[0] ?? "";
                    const secondLetter = words[1]?.[0] ?? "";
                    return (firstLetter + secondLetter).toUpperCase();
                  })()}
                </AvatarFallback>
              </Avatar>

              {hasEmail ? (
                <TooltipProvider>
                  <div className="flex items-center">
                    <Tooltip>
                      <TooltipTrigger>
                        <div className="w-20 truncate text-sm text-muted-foreground lg:w-20 xl:w-40 cursor-default">
                          {item.clientEmail}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <span>{item.clientEmail}</span>
                      </TooltipContent>
                    </Tooltip>

                    <ClipboardCopyButton email={item.clientEmail as string}/>
                  </div>
                </TooltipProvider>
              ) : (
                <p className="text-sm text-muted-foreground hidden sm:block w-40">
                  No email
                </p>
              )}

              <div className="ml-auto font-medium whitespace-nowrap">
                +
                {formatCurrency({
                  amount: item.total,
                  currency: item.currency as Currency,
                })}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
