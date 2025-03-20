"use client";

import { LoadingButton } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { PasswordInput } from "@/components/ui/password-input";
import {
  changePasswordSchema,
  ChangePasswordValues,
} from "@/validations/user/change-password-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { changePassword } from "../actions";

export default function ChangePasswordForm({ userId }: { userId: string }) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<ChangePasswordValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  function onSubmit(values: ChangePasswordValues) {
    startTransition(async () => {
      const result = await changePassword({ ...values }, userId);

      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success(result.success);
        form.reset();
      }
    });
  }
  return (
    <Card className="w-full mx-auto max-w-2xl">
      {" "}
      {/* max-w-2xl ensures the width */}
      <CardContent className="p-6 space-y-6">
        <h2 className="text-3xl font-semibold text-center">Change Password</h2>
        <p className="text-muted-foreground text-center text-sm">
          Secure your account by updating your password.
        </p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="oldPassword"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Current Password</FormLabel>
                  <FormControl>
                    <PasswordInput
                      {...field}
                      placeholder="Enter current password"
                      error={!!fieldState.error}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="newPassword"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <PasswordInput
                      {...field}
                      placeholder="Enter new password"
                      error={!!fieldState.error}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmNewPassword"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Confirm New Password</FormLabel>
                  <FormControl>
                    <PasswordInput
                      {...field}
                      placeholder="Confirm new password"
                      error={!!fieldState.error}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end">
              <LoadingButton
                type="submit"
                loading={isPending}
                className="w-full sm:w-auto"
              >
                {isPending ? "Updating..." : "Update Password"}
              </LoadingButton>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
