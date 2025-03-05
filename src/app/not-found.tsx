"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function NotFoundPage() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center gap-4"
      >
        <AlertTriangle className="size-12 text-destructive" />
        <h1 className="text-4xl font-bold tracking-tight text-foreground">
          404 - Page Not Found
        </h1>
        <p className="text-muted-foreground max-w-md">
          Oops! The page you’re looking for doesn’t exist or has been moved.
        </p>
        <Button className="mt-4" onClick={() => router.back()}>
          Go Back
        </Button>
      </motion.div>
    </div>
  );
}
