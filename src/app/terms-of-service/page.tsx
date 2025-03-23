import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
};

export default function TermsOfService() {
  return (
    <div className="container mx-auto py-12 px-6 max-w-4xl">
      <h1 className="text-4xl font-bold mb-6 text-center text-primary">
        Terms of Service
      </h1>

      <div className="space-y-8 text-muted-foreground">
        <section>
          <h2 className="text-2xl font-bold mb-4">1. Acceptance of Terms</h2>
          <p>
            By accessing and using Invoico, you accept and agree to be bound by
            these terms of service. If you do not agree, please do not use our
            service.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">2. User Accounts</h2>
          <p>
            You are responsible for maintaining the confidentiality of your
            account and password and for restricting access to your device. You
            agree to accept responsibility for all activities that occur under
            your account.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">3. Subscriptions</h2>
          <p>
            Invoico offers subscription plans with varying features. You are
            responsible for managing your subscription and ensuring payments are
            made on time.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">4. Cancellation & Refunds</h2>
          <p>
            You may cancel your subscription at any time. Refunds are not
            guaranteed and are at the sole discretion of Invoico.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">5. Intellectual Property</h2>
          <p>
            All content provided by Invoico, including text, graphics, logos,
            and software, is the property of Invoico and is protected by
            applicable copyright and trademark laws.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">
            6. Limitation of Liability
          </h2>
          <p>
            Invoico is not liable for any damages resulting from the use or
            inability to use the service, including but not limited to
            incidental, consequential, or direct damages.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">7. Modifications to Terms</h2>
          <p>
            We reserve the right to update or modify these terms at any time.
            Your continued use of Invoico following any changes constitutes
            acceptance of those changes.
          </p>
        </section>
      </div>
    </div>
  );
}
