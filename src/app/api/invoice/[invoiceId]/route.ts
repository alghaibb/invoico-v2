import prisma from "@/lib/prisma";
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

  // Format Dates
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

  // Set Default Font
  pdf.setFont("helvetica", "normal");

  /** 🏆 HEADER **/
  pdf.setFontSize(24);
  pdf.setFont("helvetica", "bold");
  pdf.text(data.invoiceName, 105, y, { align: "center" });
  y += 10;

  pdf.setLineWidth(0.5);
  pdf.line(marginLeft, y, 190, y);
  y += 10;

  /** ✉️ FROM Section **/
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

  /** 📬 TO Section **/
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

  /** 📑 INVOICE DETAILS **/
  pdf.setFontSize(12);
  pdf.setFont("helvetica", "bold");
  pdf.text("Invoice Details:", marginLeft, y);
  y += 6;

  // Set all text in the same column (left-aligned)
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(10);

  // Labels
  pdf.text("Invoice Number:", marginLeft, y);
  y += 5; // Small gap
  pdf.text("Invoice Date:", marginLeft, y);
  y += 5; // Small gap
  pdf.text("Due Date:", marginLeft, y);
  y += 6; // Extra spacing for clarity

  // Set values below their respective labels
  pdf.setFont("helvetica", "bold");
  pdf.text(`${data.invoiceNumber}`, marginLeft + 27, y - 16); // Align to the right of the label13131313131313131313131313131313
  pdf.text(`${formattedDate}`, marginLeft + 22, y - 11);
  pdf.text(`${formattedDueDate}`, marginLeft + 17, y - 6);
  y += 10; // Move down after section

  // Separator line
  pdf.setLineWidth(0.5);
  pdf.line(marginLeft, y, 190, y);
  y += 10;

  /** 📋 TABLE HEADERS **/
  pdf.setFontSize(12);
  pdf.setFont("helvetica", "bold");
  pdf.text("Description", marginLeft, y);
  pdf.text("Qty", 120, y);
  pdf.text("Price", 140, y);
  pdf.text("Amount", 160, y);
  y += 6;

  pdf.setLineWidth(0.5);
  pdf.line(marginLeft, y, 190, y);
  y += 6;

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(10);

  /** 🛒 TABLE DATA **/
  let subtotal = 0;
  data.invoiceItems.forEach((item, index) => {
    const amount = Number(item.quantity) * Number(item.price);
    subtotal += amount;

    if (index % 2 === 0) {
      pdf.setFillColor(245, 245, 245);
      pdf.rect(marginLeft, y - 5, 170, 8, "F");
    }

    pdf.text(item.description, marginLeft, y);
    pdf.text(item.quantity.toString(), 120, y);
    pdf.text(`$${item.price.toFixed(2)}`, 140, y);
    pdf.text(`$${amount.toFixed(2)}`, 160, y);
    y += 8;
  });

  y += 5;
  pdf.setLineWidth(0.5);
  pdf.line(marginLeft, y, 190, y);
  y += 10;

  /** 💰 TOTAL SECTION **/
  const taxAmount = (subtotal * data.tax) / 100;
  const totalAmount = subtotal + taxAmount;

  pdf.setFontSize(12);
  pdf.setFont("helvetica", "bold");
  pdf.text("Subtotal:", 140, y);
  pdf.setFont("helvetica", "normal");
  pdf.text(`$${subtotal.toFixed(2)}`, 170, y);
  y += 8;

  pdf.setFont("helvetica", "bold");
  pdf.text(`Tax (${data.tax}%):`, 140, y);
  pdf.setFont("helvetica", "normal");
  pdf.text(`$${taxAmount.toFixed(2)}`, 170, y);
  y += 8;

  pdf.setFont("helvetica", "bold");
  pdf.text("Total:", 140, y);
  pdf.setFont("helvetica", "bold");
  pdf.text(`$${totalAmount.toFixed(2)}`, 170, y);
  y += 12;

  pdf.setLineWidth(0.5);
  pdf.line(marginLeft, y, 190, y);
  y += 10;

  /** 📝 OPTIONAL NOTES **/
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

  /** 🏁 FOOTER **/
  pdf.setFontSize(10);
  pdf.setFont("helvetica", "italic");
  pdf.text("Thank you for your business!", 105, y, { align: "center" });

  // Generate PDF
  const buffer = Buffer.from(pdf.output("arraybuffer"));
  return new Response(buffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": "inline",
    },
  });
}
