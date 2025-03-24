"use server";

import prisma from "@/lib/prisma";
import { getSession } from "@/utils/session";
import { getUserSubscription } from "@/utils/get-user-subscription";
import { canCreateInvoice } from "@/utils/permissions";
import { resetInvoiceCountIfNeeded } from "@/utils/reset-invoice-count";

export async function checkInvoiceLimit() {
  const session = await getSession();
  if (!session || !session.user?.id) {
    return { error: "Unauthorized: You need to be logged in." };
  }

  const userId = session.user.id;

  // Reset the invoice count if a new month has started
  await resetInvoiceCountIfNeeded(userId);

  // Check the user's subscription type
  const subscriptionType = await getUserSubscription(userId);

  // Get the user's current invoice count for the month
  const usageRecord = await prisma.userMonthlyInvoiceUsage.findUnique({
    where: { userId },
  });

  const currentInvoiceCount = usageRecord?.invoiceCount ?? 0;

  // Check if the user can create more invoices
  const canCreate = canCreateInvoice(subscriptionType, currentInvoiceCount);

  if (!canCreate) {
    return { error: "You have reached your monthly invoice limit." };
  }

  return { success: true };
}
