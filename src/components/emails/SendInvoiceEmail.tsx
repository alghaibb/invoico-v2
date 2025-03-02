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
  downloadLink: string;
}

export const SendInvoiceEmail = ({
  clientName,
  downloadLink,
}: SendInvoiceEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Your Invoice from Invoico</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section>
            <Text style={text}>Hello {clientName},</Text>
            <Text style={text}>
              Your invoice is ready. Click the button below to download it.
            </Text>
            <Button style={button} href={downloadLink}>
              Download Invoice
            </Button>
            <Text style={text}>Thank you for using Invoico.</Text>
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
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const logo = { display: "block", margin: "0 auto 20px" };
