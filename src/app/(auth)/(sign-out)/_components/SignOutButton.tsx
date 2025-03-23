"use client";

import { LoadingButton } from "@/components/ui/button";
import { useTransition } from "react";
import { signOut } from "../actions";

type ButtonVariants =
  | "default"
  | "destructive"
  | "outline"
  | "outlineSecondary"
  | "secondary"
  | "ghost"
  | "link"
  | "expandIcon"
  | "ringHover"
  | "shine"
  | "gooeyRight"
  | "gooeyLeft"
  | "linkHover1"
  | "modernHover";

interface SignOutProps {
  className?: string;
  variant?: ButtonVariants;
}

export default function SignOutButton({ className, variant }: SignOutProps) {
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
      variant={variant}
    >
      {isPending ? "Signing out" : "Sign out"}
    </LoadingButton>
  );
}
