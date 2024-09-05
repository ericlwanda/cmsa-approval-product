import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import Modal from "@/lib/services/Modal";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { usePaymentTypeFormStore } from "./payment-type-form-store";
import { GET, POST, PUT } from "@/lib/client/client";
import { Icons } from "@/components/Icons";

import { tokenFromSession } from "@/lib/tokenFromSession";


const PaymentTypeFormSchema = z.object({
  name: z.string(),
  LicenseType: z.string(),
  amount: z.number().int(),
  type:z.number().int(),
  for_company:z.number().int(),
});

interface Props {
  licenseTypeId?: string;
}

type PaymentTypeFormValues = z.infer<typeof PaymentTypeFormSchema>;
export default function PaymentTypeForm({ licenseTypeId }: Props) {
  const token = tokenFromSession();
  const { editingPaymentType, open, close, create, viewing } =
    usePaymentTypeFormStore();
  const queryClient = useQueryClient();
  const form = useForm<PaymentTypeFormValues>({
    resolver: zodResolver(PaymentTypeFormSchema),
    defaultValues: {
      name: "",
      LicenseType: "",
      amount: 0,
      type:0,
      for_company:0,
    },
  });


  usePaymentTypeFormStore.subscribe((state, _) => {
    if (state.editingPaymentType) {
      form.reset({
        // name: state.editingPaymentType.name ?? undefined,
        // LicenseType: state.editingPaymentType.license_types.id ?? undefined,
        amount: state?.editingPaymentType?.amount ?? undefined,
        type: state?.editingPaymentType?.type ?? undefined,
        for_company: state?.editingPaymentType?.for_company ?? undefined,
      });
    } else {
      form.reset({
        name: undefined,
        LicenseType: undefined,
        amount: undefined,
        type: undefined,
        for_company:undefined
      });
    }
  });

  //query mutation for create
  const {
    mutate: PaymentType,
    isPending,
    error: createError,
    isError: isCreatingError,
    reset: resetCreate,
  } = useMutation({
    mutationFn: (values: PaymentTypeFormValues) =>
      POST("payment-type/create", values, token),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`paymentTypes/${licenseTypeId}`], // Use the dynamic query key here
      });
      close();
      //reset form
      form.reset();
      //show notification
      toast({
        title: "Success!",
        description: "Payment Type created successfully",
      });
    },
  });

  //query mutation for update
  const {
    mutate: update,
    isPending: isUpdating,
    error: updateError,
    isError: isUpdatingError,
    reset: resetUpdate,
  } = useMutation({
    mutationFn: (values: PaymentTypeFormValues) =>
      PUT(`/payment-type/update/${editingPaymentType!.id}`, values, token),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`paymentTypes/${licenseTypeId}`], // Use the dynamic query key here
      });
      close();
      //reset form
      form.reset();
      //show notification
      toast({
        title: "Success!",
        description: "Payment Type updated successfully",
      });
    },
  });
  const error = createError as any;
  function onSubmit(data: PaymentTypeFormValues) {

    if(data.type == 1){
      data.name = "Application fee"
    }else if(data.type == 2){
      data.name = "Annual fee"
    }else{
      data.name = "Admission fee"
    }

    data.LicenseType = licenseTypeId ?? "";
    if (editingPaymentType) {
      update(data);
      return;
    }
    PaymentType(data);
  }
  return (
    <Modal
      Title={
        viewing
          ? "View PaymentType"
          : editingPaymentType
          ? "Edit PaymentType"
          : "Create PaymentType"
      }
      Description=""
      content={
        <>
          {/* zod form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
              <div className=" flex flex-row  w-full space-x-3">
                <div className=" flex flex-col gap-3 w-full">
                  {/* <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          name
                          {!viewing && (
                            <span className=" text-destructive"> * </span>
                          )}
                        </FormLabel>
                        <FormControl>
                          <Input
                            className=""
                            disabled={viewing}
                            placeholder="Name"
                            {...field}
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  /> */}

            
                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Amount
                          {!viewing && (
                            <span className=" text-destructive"> * </span>
                          )}
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            className=""
                            disabled={viewing}
                            placeholder="Amount"
                            {...field}
                            value={
                              field.value !== undefined
                                ? Number(field.value)
                                : ""
                            }
                            onChange={(e) => {
                              const value = e.target.value
                                ? Number(e.target.value)
                                : "";
                              field.onChange(value);
                            }}
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel></FormLabel>
                        <FormControl>
                          <div className="flex space-x-4">
                            <label>
                              <input
                                type="radio"
                                value="1"
                                checked={field.value === 1}
                                onChange={() => field.onChange(1)}
                                disabled={viewing}
                              />
                              Application fee
                            </label>
                            <label>
                              <input
                                type="radio"
                                value="2"
                                checked={field.value === 2}
                                onChange={() => field.onChange(2)}
                                disabled={viewing}
                              />
                              Annual fee
                            </label>
                            <label>
                              <input
                                type="radio"
                                value="3"
                                checked={field.value === 3}
                                onChange={() => field.onChange(3)}
                                disabled={viewing}
                              />
                              Admission fee
                            </label>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="for_company"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel></FormLabel>
                        <FormControl>
                          <div className="flex space-x-4">
                            <label>
                              <input
                                type="radio"
                                value="1"
                                checked={field.value === 1}
                                onChange={() => field.onChange(1)}
                                disabled={viewing}
                              />
                              Company
                            </label>
                            <label>
                              <input
                                type="radio"
                                value="0"
                                checked={field.value === 0}
                                onChange={() => field.onChange(0)}
                                disabled={viewing}
                              />
                              Representative
                            </label>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {!viewing && (
                <DialogFooter>
                  <Button
                    variant="secondary"
                    onClick={(e) => {
                      e.preventDefault();
                      close();
                      form.reset();
                    }}
                  >
                    Cancel
                  </Button>

                  <Button type="submit" disabled={isPending || isUpdating}>
                    {(isPending || isUpdating) && (
                      <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                    )}{" "}
                    {editingPaymentType ? "Update" : "Create"}
                  </Button>
                </DialogFooter>
              )}
            </form>
          </Form>
        </>
      }
      triggerButton={
        <Button
          onClick={() => {
            create();
            form.reset();
          }}
          size="sm"
        >
          Create PaymentType
        </Button>
      }
      opened={open}
      onChange={() => {
        if (open) {
          close();
        } else {
          form.reset();
        }
      }}
    />
  );
}
