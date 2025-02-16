"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { LoadingButton } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  magicLinkSignUpSchema,
  MagicLinkSignUpValues,
} from "@/validations/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { magicLinkSignUp } from "./actions";

export default function MagicLinkSignUpForm() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const form = useForm<MagicLinkSignUpValues>({
    resolver: zodResolver(magicLinkSignUpSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
    },
  });

  async function onSubmit(values: z.infer<typeof magicLinkSignUpSchema>) {
    setError(null);
    setSuccess(null);

    startTransition(async () => {
      const res = await magicLinkSignUp(values);
      if (res?.error) {
        setError(res.error);
      } else if (res?.success) {
        setSuccess(res.success);
        form.reset();
      }
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="py-10 mx-auto space-y-6"
      >
        {error && (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert>
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First Name</FormLabel>
              <FormControl>
                <Input placeholder="John" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Last Name{" "}
                <span className="text-xs text-muted-foreground">
                  (Optional)
                </span>
              </FormLabel>
              <FormControl>
                <Input placeholder="Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address</FormLabel>
              <FormControl>
                <Input
                  placeholder="johndoe@gmail.com"
                  type="email"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <LoadingButton
          type="submit"
          className="w-full"
          loading={isPending}
          disabled={isPending}
        >
          {isPending ? "Sending Magic Link..." : "Sign Up with Magic Link"}
        </LoadingButton>
      </form>
    </Form>
  );
}
