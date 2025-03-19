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
import { Input } from "@/components/ui/input";
import { updateUserSchema, UpdateUserValues } from "@/validations/user-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { updateUserProfile } from "./actions";

interface ProfileFormProps {
  firstName: string;
  lastName: string;
  email: string;
}

export default function ProfileForm({
  firstName,
  lastName,
  email,
}: ProfileFormProps) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<UpdateUserValues>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: { firstName, lastName },
  });

  const isDirty = form.formState.isDirty;

  function onSubmit(values: z.infer<typeof updateUserSchema>) {
    if (!isDirty) return;

    startTransition(async () => {
      const result = await updateUserProfile(values);
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success("Profile updated successfully!");
        form.reset(values);
      }
    });
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardContent className="p-6 space-y-6">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-6 space-y-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Enter your first name"
                        error={!!fieldState.error}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastName"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Enter your last name"
                        error={!!fieldState.error}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div>
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input value={email} disabled className="w-full" />
                </FormControl>
              </FormItem>
            </div>

            <LoadingButton
              type="submit"
              loading={isPending}
              className="w-full md:w-auto"
              disabled={!isDirty}
            >
              {isPending ? "Saving..." : "Save Changes"}
            </LoadingButton>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
