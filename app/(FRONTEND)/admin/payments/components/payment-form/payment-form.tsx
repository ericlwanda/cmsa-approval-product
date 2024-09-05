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
import React from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { usePaymentFormStore } from "./payment-form-store";
import { GET, POST, PUT } from "@/lib/client/client";
import { tokenFromSession } from "@/lib/tokenFromSession";

const PaymentFormSchema = z.object({
  control_number: z.string(),
  status: z.string(),
});

type PaymentFormValues = z.infer<typeof PaymentFormSchema>;
export default function PaymentForm() {
  const token = tokenFromSession();
  const { open, close, create } = usePaymentFormStore();
  const queryClient = useQueryClient();
  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(PaymentFormSchema),
    defaultValues: {
      control_number: "",
      status: "",
    },
  });

  usePaymentFormStore.subscribe((state, _) => {
    form.reset({
      control_number: undefined,
      status: undefined,
    });
  });

  //query mutation for create
  const {
    mutate: pay,
    isPending,
    error: createError,
    isError: isCreatingError,
    reset: resetCreate,
  } = useMutation({
    mutationFn: (values: PaymentFormValues) =>
      PUT("application/payment-callback", values, token),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["payment"],
      });
      close();
      //reset form
      form.reset();
      //show notification
      toast({
        title: "Success!",
        description: "payment created successfully",
      });
    },
  });

  //query mutation for update

  const error = createError as any;
  function onSubmit(data: PaymentFormValues) {
    pay(data);
  }
  return (
    <Modal
      Title="Create payment"
      Description=""
      content={
        <>
          {/* zod form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
              <div className=" flex flex-row  w-full space-x-3">
                <div className=" flex flex-col gap-3 w-full">
                  <FormField
                    control={form.control}
                    name="control_number"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Control number
                          <span className=" text-destructive"> * </span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            className=""
                            placeholder="Control number"
                            {...field}
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          status
                          <span className=" text-destructive"> * </span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            className=""
                            placeholder="0/1"
                            {...field}
                            type="number"
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button
                  variant="secondary"
                  onClick={(e) => {
                    e.preventDefault();
                    close();
                    form.reset();
                  }}
                  disabled={isPending}
                >
                  Cancel
                </Button>

                <Button type="submit" disabled={isPending}>
                  Create
                </Button>
              </DialogFooter>
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
          Create Payment
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
