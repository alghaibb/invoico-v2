"use client";

import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/useModal";
import { PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { checkInvoiceLimit } from "./actions";

export default function CreateInvoiceButton() {
  const router = useRouter();
  const { openSubscriptionModal } = useModal();

  const handleClick = async () => {
    const result = await checkInvoiceLimit();

    if (result?.error) {
      toast.error(result.error);

      setTimeout(() => {
        openSubscriptionModal();
      }, 2000);
    } else {
      router.push("/dashboard/invoices/create");
    }
  };

  return (
    <Button
      onClick={handleClick}
      variant="outline"
      className="flex items-center gap-2"
    >
      <PlusIcon className="size-5" />
      <span className="hidden md:inline">Create Invoice</span>
    </Button>
  );
}
