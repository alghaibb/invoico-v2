/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Body,
  Container,
  Head,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import { env } from "@/env";

interface InvoicoResendOTPEmailProps {
  userFirstname: string;
  otp: string;
}

const baseUrl = env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export const ResendOTPEmail = ({
  userFirstname,
  otp,
}: InvoicoResendOTPEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Resend OTP for Invoico Account Verification</Preview>
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
            <Text style={text}>Hello {userFirstname},</Text>
            <Text style={text}>
              You requested a new OTP for verifying your <b>Invoico</b> account.
              Use the code below:
            </Text>

            <Text
              style={{
                ...text,
                fontSize: "24px",
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              {otp}
            </Text>

            <Text style={text}>
              This OTP will expire in <b>15 minutes</b>. If you did not request this, you can safely ignore this email.
            </Text>
            <Text style={text}>The Invoico Team</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default ResendOTPEmail;

// Styles
const main = {
  backgroundColor: "#f8fafc",
  padding: "10px 0",
};

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

const anchor = {
  color: "#1d4ed8",
  textDecoration: "underline",
};

const logo = {
  display: "block",
  margin: "0 auto 20px",
};
