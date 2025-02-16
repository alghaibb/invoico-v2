/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { verifyMagicLink } from "./actions";

export default function VerifyMagicLinkPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      setError("Invalid magic link.");
      setLoading(false);
      return;
    }

    const verify = async () => {
      try {
        await verifyMagicLink(token);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, [token]);

  return (
    <div className="md:p-8">
      <h2 className="text-2xl md:text-center">
        {error ? "Verification Failed" : "Verifying Your Magic Link..."}
      </h2>
      <p className="mt-2 text-sm text-muted-foreground md:text-center">
        {error
          ? error
          : "Please wait while we verify your magic link and sign you in automatically."}
      </p>

      <Separator className="my-6" />

      <div className="mt-6 text-center">
        <Button asChild variant="outline">
          <Link href="/">Back to Home</Link>
        </Button>
      </div>
    </div>
  );
}
