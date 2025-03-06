"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button, LoadingButton } from "@/components/ui/button";
import {
  ResponsiveModal,
  ResponsiveModalContent,
  ResponsiveModalFooter,
  ResponsiveModalHeader,
  ResponsiveModalTitle,
} from "@/components/ui/responsive-modal";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { deleteInvoice } from "../actions";

interface DeleteInvoiceModalProps {
  invoiceId: string;
  open: boolean;
  onClose: () => void;
}

export default function DeleteInvoiceModal({
  invoiceId,
  open,
  onClose,
}: DeleteInvoiceModalProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleDelete() {
    setError(null);

    startTransition(async () => {
      const result = await deleteInvoice(invoiceId);

      if (result?.error) {
        setError(result.error);
      } else {
        toast.success(result.success);
        router.push("/dashboard/invoices");
        router.refresh();
        onClose();
      }
    });
  }

  return (
    <ResponsiveModal open={open} onOpenChange={onClose}>
      <ResponsiveModalContent>
        <ResponsiveModalHeader>
          <ResponsiveModalTitle>Delete Invoice</ResponsiveModalTitle>
        </ResponsiveModalHeader>

        <div className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete this invoice? This action cannot be undone.
          </p>
        </div>

        <ResponsiveModalFooter className="gap-3 md:gap-1">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <LoadingButton
            onClick={handleDelete}
            loading={isPending}
            disabled={isPending}
            variant="destructive"
            className="w-full md:w-auto"
          >
            {isPending ? "Deleting..." : "Delete Invoice"}
          </LoadingButton>
        </ResponsiveModalFooter>
      </ResponsiveModalContent>
    </ResponsiveModal>
  );
}
