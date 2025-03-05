import prisma from "@/lib/prisma";
import { getSession } from "@/utils/session";
import { Metadata } from "next";
import CreateInvoiceForm from "../_components/forms/CreateInvoiceForm";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Create Invoice",
  description: "Create Invoice page",
};

async function getUserData(userId: string) {
  const data = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      firstName: true,
      lastName: true,
      email: true,
    },
  });

  return data;
}

export default async function Page() {
  const session = await getSession();
  const userId = session?.user.id;
  if (!userId) {
    throw new Error("Unauthorized");
  }
  const userData = await getUserData(userId);

  return (
    <CreateInvoiceForm
      firstName={userData?.firstName || ""}
      lastName={userData?.lastName || ""}
      email={userData?.email || ""}
    />
  );
}
