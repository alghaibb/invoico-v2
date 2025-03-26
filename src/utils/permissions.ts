import { SubscriptionType } from "./get-user-subscription";

export function canCreateInvoice(subscriptionType: SubscriptionType, currentInvoiceCount: number) {
  const maxInvoicesMap: Record<SubscriptionType, number> = {
    free: 5,
    professional: 10,
    business: Infinity,
  };

  const maxInvoices = maxInvoicesMap[subscriptionType];

  return currentInvoiceCount < maxInvoices;
}

export function canSendEmail(subscriptionType: SubscriptionType) {
  return subscriptionType === "professional" || subscriptionType === "business";
}