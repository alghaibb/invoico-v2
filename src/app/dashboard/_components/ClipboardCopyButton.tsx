"use client";

import { ClipboardCopy } from "lucide-react";
import { toast } from "sonner";

interface ClipboardCopyButtonProps {
  email: string;
}

export default function ClipboardCopyButton({
  email,
}: ClipboardCopyButtonProps) {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(email);
    toast.success("Email copied to clipboard!");
  };

  return (
    <ClipboardCopy
      className="w-4 h-4 text-muted-foreground cursor-pointer hover:text-foreground"
      onClick={copyToClipboard}
      aria-label="Copy email to clipboard"
    />
  );
}
