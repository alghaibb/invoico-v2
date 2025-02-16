import { env } from "@/env";
import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface MagicLinkEmailProps {
  userFirstName?: string;
  magicLink: string;
}

export const MagicLinkEmail = ({
  userFirstName,
  magicLink,
}: MagicLinkEmailProps) => {
  const baseUrl = env.NEXT_PUBLIC_BASE_URL
    ? `https://${env.NEXT_PUBLIC_BASE_URL}`
    : "http://localhost:3000";

  return (
    <Html>
      <Head />
      <Preview>Your Magic Link to Sign In</Preview>
      <Body style={main}>
        <Container style={container}>
          <Img
            src={`${baseUrl}/static/invoico-logo.png`}
            width="40"
            height="40"
            alt="Invoico"
            style={logo}
          />
          <Section>
            <Text style={text}>Hello {userFirstName ?? "there"},</Text>
            <Text style={text}>
              Click the button below to securely sign in to your <b>Invoico</b>{" "}
              account:
            </Text>

            <Button style={button} href={magicLink}>
              Sign In with Magic Link
            </Button>

            <Text style={text}>
              If you <b>did not request this</b>, you can safely ignore this
              email.
            </Text>

            <Text style={text}>The Invoico Team</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default MagicLinkEmail;

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
  fontFamily: "'Arial', sans-serif",
  fontSize: "16px",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  width: "200px",
  padding: "12px",
  margin: "20px auto",
};
const logo = { display: "block", margin: "0 auto 20px" };
