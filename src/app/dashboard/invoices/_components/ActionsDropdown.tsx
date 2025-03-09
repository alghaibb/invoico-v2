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
import { useOptimistic, useState } from "react";
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
  // const [isPending, startTransition] = useTransition();
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  const [optimisticStatus, setOptimisticStatus] = 
    useOptimistic<InvoiceStatus>(initialStatus);

  async function handleMarkAsPaid() {
  if (optimisticStatus === "PAID") return;
  
  setOptimisticStatus("PAID");
  
  const result = await markInvoiceAsPaid(invoiceId, "PAID");
  
  if (result?.error) {
    setOptimisticStatus(initialStatus);
  } else if (result?.success) {
    toast.success(result.success);
  }
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
            onClick={() => setIsSendModalOpen(true)}
            className="flex items-center gap-2"
          >
            <div className="flex items-center gap-2 cursor-default">
              <Mail className="size-4 text-yellow-500" />
              <span>Send Invoice</span>
            </div>
          </DropdownMenuItem>
          
          <DropdownMenuItem
            onClick={handleMarkAsPaid}
            disabled={optimisticStatus === "PAID" || isPending}
            className="flex items-center gap-2 cursor-pointer"
          >
            <CheckCircle className={`size-4 ${
              optimisticStatus === "PAID" ? "text-green-600" : "text-green-500"
            }`} />
            <span>
              {optimisticStatus === "PAID" ? "Marked as Paid" : "Mark as Paid"}
            </span>
            {isPending && optimisticStatus === "PAID" && (
              <span className="ml-auto h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-primary" />
            )}
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