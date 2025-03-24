import prisma from "@/lib/prisma";

export async function resetInvoiceCountIfNeeded(userId: string) {
  const now = new Date();
  const currentMonth = now.getMonth() + 1; 
  const currentYear = now.getFullYear();

  const existingUsage = await prisma.userMonthlyInvoiceUsage.findUnique({
    where: { userId },
  });

  if (!existingUsage || existingUsage.month !== currentMonth || existingUsage.year !== currentYear) {
    await prisma.userMonthlyInvoiceUsage.upsert({
      where: { userId },
      update: { invoiceCount: 0, month: currentMonth, year: currentYear },
      create: {
        userId,
        invoiceCount: 0,
        month: currentMonth,
        year: currentYear,
      },
    });
  }
}
