import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface SendInvoiceEmailProps {
  clientName: string;
  invoiceNumber: string;
  dueDate: string;
  total: string;
  downloadLink: string;
  senderName?: string;
}

export const SendInvoiceEmail = ({
  clientName,
  invoiceNumber,
  dueDate,
  total,
  downloadLink,
  senderName,
}: SendInvoiceEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Invoice from {senderName as string}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section>
            <Text style={text}>Dear {clientName},</Text>
            <Text style={text}>
              We hope this email finds you well. Below are the details of your
              invoice from <b>{senderName}</b>. You can download it using the
              button below.
            </Text>

            <Text style={text}>
              <b>Invoice Details:</b>
            </Text>
            <ul style={list}>
              <li>
                <b>Invoice Number:</b> {invoiceNumber}
              </li>
              <li>
                <b>Due Date:</b> {dueDate}
              </li>
              <li>
                <b>Total Amount:</b> {total}
              </li>
            </ul>

            <Button style={button} href={downloadLink}>
              Download Invoice
            </Button>

            <Text style={text}>
              If you have any questions or need further assistance, feel free to
              reach out.
            </Text>
            <Text style={text}>Best regards,</Text>
            <Text style={text}>
              <b>{senderName}</b>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

// Styles
const main = { backgroundColor: "#f8fafc", padding: "10px 0" };
const container = {
  backgroundColor: "#ffffff",
  border: "1px solid #e5e7eb",
  padding: "40px",
  borderRadius: "8px",
};
const text = {
  fontSize: "16px",
  fontFamily: "'Arial', sans-serif",
  color: "#374151",
  lineHeight: "24px",
};
const button = {
  backgroundColor: "#09090b",
  borderRadius: "6px",
  color: "#ffffff",
  textAlign: "center" as const,
  display: "block",
  width: "200px",
  padding: "12px",
  margin: "20px auto",
};
const list = {
  fontSize: "16px",
  fontFamily: "'Arial', sans-serif",
  color: "#374151",
  lineHeight: "24px",
  paddingLeft: "20px",
};

export default SendInvoiceEmail;
