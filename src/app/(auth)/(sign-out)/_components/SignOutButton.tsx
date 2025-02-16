"use client";

import { LoadingButton } from "@/components/ui/button";
import { useTransition } from "react";
import { signOut } from "../actions";

interface SignOutProps {
  className?: string;
}

export default function SignOutButton({ className }: SignOutProps) {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    startTransition(() => {
      signOut();
    });
  }

  return (
    <LoadingButton
      onClick={handleClick}
      loading={isPending}
      disabled={isPending}
      className={className}
    >
      {isPending ? "Signing out" : "Sign out"}
    </LoadingButton>
  );
}
