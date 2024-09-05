import * as z from "zod";
export const CreatePaymentSchema = z.object({
    paymentType: z.string().min(1, {
      message: "payment type is required",
    }),
    description: z.string().min(1, {
      message: "description type is required",
    }),
    quantity: z.number().min(1, {
      message: "Quantity must be at least 1",
    }),
    amount: z.number().min(0.01, {
      message: "Amount must be greater than 0",
    }),
    code: z.optional(z.string()),
  });


  export const PaymentCallbackSchema = z.object({
    control_number: z.string().min(1, {
      message: "control number is required",
    }),
    status: z.string().min(1, {
      message: "status is required",
    }),
    code: z.optional(z.string()),
  });