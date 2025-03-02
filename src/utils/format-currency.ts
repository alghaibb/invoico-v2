import { Currency } from "@/types/currency";

interface FormatCurrencyProps {
  amount: number;
  currency: Currency;
}

export function formatCurrency({ amount, currency }: FormatCurrencyProps) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount);
}
