import prisma from "@/lib/prisma";
import { Currency } from "@/types/currency";
import { formatCurrency } from "@/utils/format-currency";
import jsPDF from "jspdf";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ invoiceId: string }> }
) {
  const { invoiceId } = await params;

  const data = await prisma.invoice.findUnique({
    where: { id: invoiceId },
    select: {
      invoiceName: true,
      invoiceNumber: true,
      currency: true,
      fromName: true,
      fromEmail: true,
      fromAddress: true,
      clientName: true,
      clientEmail: true,
      clientAddress: true,
      tax: true,
      total: true,
      date: true,
      dueDate: true,
      notes: true,
      invoiceItems: {
        select: {
          description: true,
          quantity: true,
          price: true,
        },
      },
    },
  });

  if (!data) {
    return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
  }

  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const marginLeft = 20;
  let y = 20;

  const formattedDate = new Intl.DateTimeFormat("en-AU", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(data.date));

  const formattedDueDate = new Intl.DateTimeFormat("en-AU", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(new Date(data.date).setDate(new Date(data.date).getDate() + data.dueDate)));

  // Header
  pdf.setFont("helvetica", "normal");

  pdf.setFontSize(24);
  pdf.setFont("helvetica", "bold");
  pdf.text(data.invoiceName, 105, y, { align: "center" });
  y += 10;

  pdf.setLineWidth(0.5);
  pdf.line(marginLeft, y, 190, y);
  y += 10;

  // From 
  pdf.setFontSize(12);
  pdf.setFont("helvetica", "bold");
  pdf.text("From:", marginLeft, y);
  y += 6;
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(10);
  pdf.text(data.fromName, marginLeft, y);
  y += 5;
  if (data.fromEmail) {
    pdf.text(data.fromEmail, marginLeft, y);
    y += 5;
  }
  if (data.fromAddress) {
    pdf.text(data.fromAddress, marginLeft, y);
    y += 5;
  }
  y += 8;

  // Bill To
  pdf.setFontSize(12);
  pdf.setFont("helvetica", "bold");
  pdf.text("Bill To:", marginLeft, y);
  y += 6;
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(10);
  pdf.text(data.clientName, marginLeft, y);
  y += 5;
  if (data.clientEmail) {
    pdf.text(data.clientEmail, marginLeft, y);
    y += 5;
  }
  if (data.clientAddress) {
    pdf.text(data.clientAddress, marginLeft, y);
    y += 5;
  }
  y += 8;

  // Invoice Details
  pdf.setFontSize(12);
  pdf.setFont("helvetica", "bold");
  pdf.text("Invoice Details:", marginLeft, y);
  y += 6;

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(10);

  pdf.text("Invoice Number:", marginLeft, y);
  y += 5;
  pdf.text("Invoice Date:", marginLeft, y);
  y += 5;
  pdf.text("Due Date:", marginLeft, y);
  y += 6;

  pdf.setFont("helvetica", "bold");
  pdf.text(`${data.invoiceNumber}`, marginLeft + 27, y - 16);
  pdf.text(`${formattedDate}`, marginLeft + 22, y - 11);
  pdf.text(`${formattedDueDate}`, marginLeft + 17, y - 6);
  y += 10;


  pdf.setLineWidth(0.5);
  pdf.line(marginLeft, y, 190, y);
  y += 10;

  pdf.setFontSize(12);
  pdf.setFont("helvetica", "bold");
  pdf.text("Description", marginLeft, y);
  pdf.text("Qty", 105, y);
  pdf.text("Price", 140, y, { align: "right" });
  pdf.text("Amount", 190, y, { align: "right" });
  y += 6;

  pdf.setLineWidth(0.5);
  pdf.line(marginLeft, y, 190, y);
  y += 6;

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(10);

  let subtotal = 0;
  data.invoiceItems.forEach((item, index) => {
    const amount = Number(item.quantity) * Number(item.price);
    subtotal += amount;

    if (y > 270) {
      pdf.addPage();
      y = 20;
    }

    if (index % 2 === 0) {
      pdf.setFillColor(245, 245, 245);
      pdf.rect(marginLeft, y - 5, 170, 8, "F");
    }

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10);

    pdf.text(item.description, marginLeft + 2, y);
    pdf.text(item.quantity.toString(), 105, y);
    pdf.text(formatCurrency({ amount: Number(item.price), currency: data.currency as Currency }), 138, y, { align: "right" });
    pdf.text(formatCurrency({ amount, currency: data.currency as Currency }), 188, y, { align: "right" });
    y += 8;
  });

  y += 5;
  pdf.setLineWidth(0.5);
  pdf.line(marginLeft, y, 190, y);
  y += 10;

  const taxAmount = (subtotal * data.tax) / 100;
  const totalAmount = subtotal + taxAmount;

  pdf.setFontSize(12);
  pdf.setFont("helvetica", "bold");
  pdf.text("Subtotal:", 140, y);
  pdf.setFont("helvetica", "normal");
  pdf.text(formatCurrency({ amount: subtotal, currency: data.currency as Currency }), 190, y, { align: "right" });
  y += 8;

  pdf.setFont("helvetica", "bold");
  pdf.text(`Tax (${data.tax}%):`, 140, y);
  pdf.setFont("helvetica", "normal");
  pdf.text(formatCurrency({ amount: taxAmount, currency: data.currency as Currency }), 190, y, { align: "right" });
  y += 8;

  pdf.setFont("helvetica", "bold");
  pdf.text("Total:", 140, y);
  pdf.setFont("helvetica", "bold");
  pdf.text(formatCurrency({ amount: totalAmount, currency: data.currency as Currency }), 190, y, { align: "right" });
  y += 12;

  pdf.setLineWidth(0.5);
  pdf.line(marginLeft, y, 190, y);
  y += 10;

  if (data.notes) {
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "bold");
    pdf.text("Notes:", marginLeft, y);
    y += 6;

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10);
    const notes = pdf.splitTextToSize(data.notes, 170);
    notes.forEach((line: string) => {
      pdf.text(line, marginLeft, y);
      y += 5;
    });

    y += 6;
  }

  pdf.setFontSize(10);
  pdf.setFont("helvetica", "italic");
  pdf.text("Thank you for your business!", 105, y, { align: "center" });

  const buffer = Buffer.from(pdf.output("arraybuffer"));
  return new Response(buffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": "inline",
    },
  });
}
