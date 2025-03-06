"use client";

import { Badge } from "@/components/ui/badge";
import { Button, LoadingButton } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { AutosizeTextarea } from "@/components/ui/textarea";
import { Currency } from "@/types/currency";
import { formatCurrency } from "@/utils/format-currency";
import {
  invoiceSchema,
  InvoiceValues,
} from "@/validations/invoice/create-invoice-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { InvoiceStatus } from "@prisma/client";
import { CalendarIcon, Plus, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { editInvoice } from "../../actions";

interface EditInvoiceFormProps {
  data: {
    id: string;
    invoiceName: string;
    total: number;
    tax: number;
    status: string;
    date: Date;
    dueDate: number;
    fromName: string;
    fromEmail: string | null;
    fromAddress: string | null;
    clientName: string;
    clientEmail: string | null;
    clientAddress: string | null;
    currency: string;
    invoiceNumber: string;
    notes: string | null;
    createdAt: Date;
    updatedAt: Date;
    invoiceItems: {
      description: string;
      quantity: number;
      price: number;
    }[];
  };
}

export default function EditInvoiceForm({ data }: EditInvoiceFormProps) {
  const [isPending, startTransition] = useTransition();
  const [selectedDate, setSelectedDate] = useState(data.date);
  const [currency, setCurrency] = useState(data.currency as Currency);
  const [selectedTax, setSelectedTax] = useState(data.tax);
  const router = useRouter();

  const form = useForm<InvoiceValues>({
    resolver: zodResolver(invoiceSchema),
    mode: "onChange",
    defaultValues: {
      invoiceName: data.invoiceName,
      invoiceNumber: data.invoiceNumber,
      total: Number(data.total),
      tax: Number(data.tax),
      status: data.status as InvoiceStatus,
      date: data.date,
      dueDate: data.dueDate,
      fromName: data.fromName,
      fromEmail: data.fromEmail as string,
      fromAddress: data.fromAddress,
      clientName: data.clientName,
      clientEmail: data.clientEmail,
      clientAddress: data.clientAddress,
      currency: data.currency,
      notes: data.notes,
      invoiceItems:
        data.invoiceItems.length > 0
          ? data.invoiceItems.map((item) => ({
              description: item.description,
              quantity: item.quantity ?? 1,
              price: item.price ?? 0,
            }))
          : [{ description: "", quantity: 1, price: 0 }],
    },
  });
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "invoiceItems",
  });

  async function onSubmit(values: z.infer<typeof invoiceSchema>) {
    startTransition(async () => {
      const result = await editInvoice(values, data.id);
      if (result?.error) {
        toast.error(result.error);
      } else if (result?.success) {
        toast.success(result.success); 
        router.push("/dashboard/invoices"); 
        router.refresh();
      }
    });
  }

  useEffect(() => {
    const subscription = form.watch((_value, { name }) => {
      if (name?.startsWith("invoiceItems") || name === "tax") {
        const items = form.getValues("invoiceItems");
        const subtotal = items.reduce(
          (acc, item) => acc + item.quantity * item.price,
          0
        );
        const taxAmount = (subtotal * selectedTax) / 100;
        const total = parseFloat((subtotal + taxAmount).toFixed(2));

        form.setValue("total", total, {
          shouldDirty: true,
          shouldTouch: true,
          shouldValidate: true,
        });
      }
    });

    return () => subscription.unsubscribe();
  }, [form, selectedTax]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="py-10">
        <Card className="w-full max-w-4xl mx-auto">
          <CardContent className="p-6 space-y-6">
            <FormField
              control={form.control}
              name="invoiceName"
              render={({ field, fieldState }) => (
                <FormItem>
                  <div className="flex flex-col gap-1 w-fit">
                    <div className="flex items-center gap-4">
                      <Badge variant="secondary">Draft</Badge>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Building Invoice"
                          error={!!fieldState.error}
                        />
                      </FormControl>
                    </div>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="py-2 md:py-4">
              <Separator />
            </div>

            <FormField
              control={form.control}
              name="invoiceNumber"
              render={({ field, fieldState }) => (
                <FormItem>
                  <div className="grid gap-6 md:grid-cols-3">
                    <div>
                      <FormLabel className="text-primary">
                        Invoice No.
                      </FormLabel>
                      <FormControl>
                        <div className="flex">
                          <span className="flex items-center px-3 border border-r-0 rounded-l-md bg-muted">
                            #
                          </span>
                          <Input
                            {...field}
                            placeholder="INV-0001"
                            className="rounded-l-none"
                            error={!!fieldState.error}
                          />
                        </div>
                      </FormControl>
                    </div>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="py-2 md:py-4">
              <Separator />
            </div>

            <div>
              <FormField
                control={form.control}
                name="currency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Currency</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={(val) => {
                          field.onChange(val);
                          setCurrency(val as Currency);
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Currency">
                            {field.value}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="AUD">AUD</SelectItem>
                          <SelectItem value="USD">USD</SelectItem>
                          <SelectItem value="EUR">EUR</SelectItem>
                          <SelectItem value="GBP">GBP</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="py-2 md:py-4">
              <Separator />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <FormLabel>From</FormLabel>
                <FormField
                  control={form.control}
                  name="fromName"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Your Name"
                          error={!!fieldState.error}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="fromEmail"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="yourname@mail.com"
                          error={!!fieldState.error}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="fromAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <AutosizeTextarea
                          {...field}
                          placeholder="Your Address"
                          value={field.value || ""}
                          onChange={(e) =>
                            field.onChange(e.target.value || null)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4">
                <FormLabel>To</FormLabel>
                <FormField
                  control={form.control}
                  name="clientName"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Client Name"
                          error={!!fieldState.error}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="clientEmail"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="client@mail.com"
                          error={!!fieldState.error}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="clientAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <AutosizeTextarea
                          {...field}
                          placeholder="Client Address"
                          value={field.value || ""}
                          onChange={(e) =>
                            field.onChange(e.target.value || null)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="py-2 md:py-4">
              <Separator />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col w-full">
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="justify-start w-full text-left"
                          >
                            <CalendarIcon className="mr-2 size-4" />
                            {selectedDate ? (
                              new Intl.DateTimeFormat("en-US", {
                                dateStyle: "long",
                              }).format(selectedDate)
                            ) : (
                              <span>Pick a Date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent>
                          <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={(date) => {
                              setSelectedDate(date || new Date());
                              field.onChange(date?.toISOString().split("T")[0]);
                            }}
                            fromDate={new Date()}
                          />
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col w-full">
                    <FormLabel>Due Date</FormLabel>
                    <FormControl>
                      <Select
                        value={String(field.value)}
                        onValueChange={(val) => field.onChange(Number(val))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select due date">
                            {field.value === 0
                              ? "Due on Receipt"
                              : `Due in ${field.value} Days`}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">Due on Receipt</SelectItem>
                          <SelectItem value="7">Due in 7 Days</SelectItem>
                          <SelectItem value="15">Due in 15 Days</SelectItem>
                          <SelectItem value="30">Due in 30 Days</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="py-2 md:py-4">
              <Separator />
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-12 gap-4 font-medium ">
                <p className="col-span-6">Description</p>
                <p className="col-span-2">Quantity</p>
                <p className="col-span-2">Price</p>
                <p className="col-span-2">Amount</p>
              </div>

              {fields.map((item, index) => (
                <div
                  key={item.id}
                  className="grid items-center grid-cols-12 gap-4"
                >
                  <FormField
                    control={form.control}
                    name={`invoiceItems.${index}.description`}
                    render={({ field, fieldState }) => (
                      <FormItem className="col-span-6">
                        <FormControl>
                          <AutosizeTextarea
                            {...field}
                            placeholder="Item description"
                            error={!!fieldState.error}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`invoiceItems.${index}.quantity`}
                    render={({ field, fieldState }) => (
                      <FormItem className="col-span-2">
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            placeholder="1"
                            min={1}
                            value={field.value || 1}
                            onChange={(e) => {
                              const value = Math.max(
                                1,
                                Number(e.target.value) || 1
                              );
                              field.onChange(value);
                              form.trigger();
                            }}
                            error={!!fieldState.error}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`invoiceItems.${index}.price`}
                    render={({ field, fieldState }) => (
                      <FormItem className="col-span-2">
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            placeholder="0"
                            value={field.value === 0 ? "" : field.value}
                            onChange={(e) => {
                              const value =
                                e.target.value === ""
                                  ? 0
                                  : Number(e.target.value);
                              field.onChange(value);
                              form.trigger();
                            }}
                            onBlur={(e) => {
                              if (e.target.value === "") {
                                field.onChange(0);
                              }
                            }}
                            error={!!fieldState.error}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex items-center justify-between col-span-2">
                    <span className="text-right">
                      {formatCurrency({
                        amount:
                          form.watch(`invoiceItems.${index}.quantity`) *
                          form.watch(`invoiceItems.${index}.price`),
                        currency,
                      })}
                    </span>
                    {fields.length > 1 && (
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => remove(index)}
                      >
                        <X className="size-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}

              <div className="flex justify-end mt-4">
                <Button
                  variant="outline"
                  onClick={() =>
                    append({ description: "", quantity: 1, price: 0 })
                  }
                >
                  <Plus className="mr-2 size-4" /> Add Item
                </Button>
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <div className="w-1/3">
                <div className="flex justify-between py-2">
                  <span>Subtotal</span>
                  <span>
                    {formatCurrency({
                      amount: form
                        .watch("invoiceItems")
                        .reduce(
                          (acc, item) => acc + item.quantity * item.price,
                          0
                        ),
                      currency,
                    })}
                  </span>
                </div>

                <div className="flex justify-between py-2 border-t">
                  <FormLabel className="flex items-center">
                    Tax Rate (%)
                  </FormLabel>
                  <Select
                    value={String(selectedTax)}
                    onValueChange={(val) => {
                      setSelectedTax(Number(val));
                      form.setValue("tax", Number(val));
                    }}
                  >
                    <SelectTrigger className="w-24">
                      <SelectValue>{selectedTax}%</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">0%</SelectItem>
                      <SelectItem value="5">5%</SelectItem>
                      <SelectItem value="10">10%</SelectItem>
                      <SelectItem value="15">15%</SelectItem>
                      <SelectItem value="20">20%</SelectItem>
                      <SelectItem value="25">25%</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex justify-between py-2 border-t">
                  <span>Tax ({selectedTax}%)</span>
                  <span>
                    {formatCurrency({
                      amount:
                        (form
                          .watch("invoiceItems")
                          .reduce(
                            (acc, item) => acc + item.quantity * item.price,
                            0
                          ) *
                          selectedTax) /
                        100,
                      currency,
                    })}
                  </span>
                </div>

                <div className="flex justify-between py-2 font-medium border-t">
                  <span>Total ({currency})</span>
                  <span className="font-bold underline underline-offset-2">
                    {formatCurrency({
                      amount: form.watch("total"),
                      currency,
                    })}
                  </span>
                </div>
              </div>
            </div>

            <div className="py-2 md:py-4">
              <Separator />
            </div>

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Note{" "}
                    <span className="text-xs text-muted-foreground">
                      (Optional)
                    </span>
                  </FormLabel>
                  <FormControl>
                    <AutosizeTextarea
                      {...field}
                      placeholder="Additional notes..."
                      value={field.value || ""}
                      onChange={(e) => field.onChange(e.target.value || null)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center justify-end mt-6">
              <LoadingButton
                type="submit"
                loading={isPending}
                disabled={isPending}
              >
                {isPending ? "Editing Invoice..." : "Edit Invoice"}
              </LoadingButton>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
}
