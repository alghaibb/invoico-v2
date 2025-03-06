"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { InvoiceStatus } from "@prisma/client";
import {
  CheckCircle,
  DownloadCloud,
  Mail,
  MoreHorizontal,
  Pencil,
  Trash,
} from "lucide-react";
import Link from "next/link";
import { useOptimistic, useState, useTransition } from "react";
import { toast } from "sonner";
import { markInvoiceAsPaid } from "../actions";
import DeleteInvoiceModal from "./DeleteInvoiceModal";
import SendInvoiceModal from "./SendInvoiceEmailModal";

interface ActionsDropdownProps {
  invoiceId: string;
  initialStatus: InvoiceStatus;
}

export default function ActionsDropdown({
  invoiceId,
  initialStatus,
}: ActionsDropdownProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_isPending, startTransition] = useTransition();

  const [isSendModalOpen, setIsSendModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [optimisticStatus, setOptimisticStatus] =
    useOptimistic<InvoiceStatus>(initialStatus);

  async function handleMarkAsPaid() {
    if (optimisticStatus === "PAID") return;

    startTransition(() => {
      setOptimisticStatus("PAID");

      markInvoiceAsPaid(invoiceId, "PAID").then((result) => {
        if (result?.error) {
          setOptimisticStatus(initialStatus);
        } else if (result?.success) {
          toast.success(result.success);
        }
      });
    });
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="hover:bg-muted">
            <MoreHorizontal className="size-4 text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem asChild>
            <Link
              href={`/dashboard/invoices/${invoiceId}`}
              className="flex items-center gap-2"
            >
              <Pencil className="size-4 text-primary" />
              <span>Edit Invoice</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link
              href={`/api/invoice/${invoiceId}`}
              rel="noopener noreferrer"
              target="_blank"
              className="flex items-center gap-2"
            >
              <DownloadCloud className="size-4 text-blue-500" />
              <span>Download</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={() => {
              setIsSendModalOpen(true);
            }}
            className="flex items-center gap-2"
          >
            <Link href="" className="flex items-center gap-2 cursor-default">
              <Mail className="size-4 text-yellow-500" />
              <span>Send Invoice</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={handleMarkAsPaid}
            className={`flex items-center gap-2 cursor-pointer ${
              optimisticStatus === "PAID"
                ? "opacity-50 pointer-events-none"
                : ""
            }`}
          >
            <CheckCircle className="size-4 text-green-500" />
            <span>
              {optimisticStatus === "PAID" ? "Marked as Paid" : "Mark as Paid"}
            </span>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={() => setIsDeleteModalOpen(true)}
            className="flex items-center gap-2 cursor-default"
          >
            <Trash className="size-4 text-destructive" />
            <span>Delete Invoice</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <SendInvoiceModal
        open={isSendModalOpen}
        invoiceId={invoiceId}
        onClose={() => setIsSendModalOpen(false)}
      />

      <DeleteInvoiceModal
        open={isDeleteModalOpen}
        invoiceId={invoiceId}
        onClose={() => setIsDeleteModalOpen(false)}
      />
    </>
  );
}
