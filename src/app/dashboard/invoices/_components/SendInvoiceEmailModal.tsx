"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button, LoadingButton } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  ResponsiveModal,
  ResponsiveModalContent,
  ResponsiveModalFooter,
  ResponsiveModalHeader,
  ResponsiveModalTitle,
} from "@/components/ui/responsive-modal";
import {
  sendInvoiceSchema,
  SendInvoiceValues,
} from "@/validations/invoice/send-invoice-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { sendInvoice } from "../actions";

interface SendInvoiceModalProps {
  invoiceId: string;
  open: boolean;
  onClose: () => void;
}

export default function SendInvoiceModal({
  invoiceId,
  open,
  onClose,
}: SendInvoiceModalProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState<number>(0);

  const form = useForm<SendInvoiceValues>({
    resolver: zodResolver(sendInvoiceSchema),
    defaultValues: {
      clientEmail: "",
    },
  });

  useEffect(() => {
    const cooldownExpireTime = localStorage.getItem(
      `invoiceCooldown_${invoiceId}`
    );

    if (cooldownExpireTime) {
      const expireTimestamp = parseInt(cooldownExpireTime, 10);
      const remainingTime = Math.ceil((expireTimestamp - Date.now()) / 1000);

      if (remainingTime > 0) {
        setCooldown(remainingTime);
      } else {
        localStorage.removeItem(`invoiceCooldown_${invoiceId}`);
      }
    }
  }, [invoiceId]);

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setInterval(() => {
        setCooldown((prev) => {
          const newCooldown = prev - 1;
          if (newCooldown <= 0) {
            localStorage.removeItem(`invoiceCooldown_${invoiceId}`);
            clearInterval(timer);
          }
          return newCooldown;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [cooldown, invoiceId]);

  async function onSubmit(values: z.infer<typeof sendInvoiceSchema>) {
    setError(null);
    setSuccess(null);

    startTransition(async () => {
      const result = await sendInvoice(values, invoiceId);
      if (result?.error) {
        setError(result.error);
      } else if (result?.success) {
        setSuccess(result.success);
        form.reset();
      }

      // ✅ Set cooldown for 60 seconds
      const cooldownEndTime = Date.now() + 60000;
      localStorage.setItem(
        `invoiceCooldown_${invoiceId}`,
        cooldownEndTime.toString()
      );
      setCooldown(60);
    });
  }

  return (
    <ResponsiveModal open={open} onOpenChange={onClose}>
      <ResponsiveModalContent>
        {/* ✅ The built-in close button (X) is already inside ResponsiveModalContent */}
        <ResponsiveModalHeader>
          <ResponsiveModalTitle>Send Invoice</ResponsiveModalTitle>
        </ResponsiveModalHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {success && (
              <Alert>
                <AlertTitle>Success</AlertTitle>
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}

            <FormField
              control={form.control}
              name="clientEmail"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Client Email Address</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="client@example.com"
                      type="email"
                      {...field}
                      error={!!fieldState.error}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <ResponsiveModalFooter className="gap-3 md:gap-1">
              {/* ✅ Only one cancel button now */}
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <LoadingButton
                type="submit"
                loading={isPending}
                disabled={isPending || cooldown > 0}
                className="w-full md:w-auto"
              >
                {isPending
                  ? "Sending..."
                  : cooldown > 0
                    ? `Retry in ${cooldown}s`
                    : "Send Invoice"}
              </LoadingButton>
            </ResponsiveModalFooter>
          </form>
        </Form>
      </ResponsiveModalContent>
    </ResponsiveModal>
  );
}
