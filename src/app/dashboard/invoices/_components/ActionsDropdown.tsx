"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  CheckCircle,
  DownloadCloud,
  Mail,
  MoreHorizontal,
  Pencil,
  Trash,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import SendInvoiceModal from "./SendInvoiceEmailModal";
import DeleteInvoiceModal from "./DeleteInvoiceModal";

interface ActionsDropdownProps {
  invoiceId: string;
}

export default function ActionsDropdown({ invoiceId }: ActionsDropdownProps) {
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

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
          <DropdownMenuItem asChild>
            <Link href="" className="flex items-center gap-2">
              <CheckCircle className="size-4 text-green-500" />
              <span>Mark as Paid</span>
            </Link>
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
