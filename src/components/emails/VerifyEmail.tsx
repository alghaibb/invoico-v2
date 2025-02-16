/* eslint-disable @typescript-eslint/no-unused-vars */
import { env } from "@/env";
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

interface CVisionaryVerifyEmailProps {
  userFirstname: string;
  otp: string;
}

const baseUrl = env.NEXT_PUBLIC_BASE_URL
  ? `https://${env.NEXT_PUBLIC_BASE_URL}`
  : "http://localhost:3000";

export const VerifyEmail = ({
  userFirstname,
  otp,
}: CVisionaryVerifyEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Verify Your Invoico Account</Preview>
      <Body style={main}>
        <Container style={container}>
          <Img
            src={`${baseUrl}/static/cvisionary-logo.png`}
            width="40"
            height="40"
            alt="CVisionary"
            style={logo}
          />
          <Section>
            <Text style={text}>Hello {userFirstname},</Text>
            <Text style={text}>
              Welcome to Invoico! To complete your registration and activate
              your account, please verify your email using the OTP below:
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
              If you did not sign up for an Invoico account, you can safely
              ignore this email.
            </Text>
            <Text style={text}>The CVisionary Team</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default VerifyEmail;

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
