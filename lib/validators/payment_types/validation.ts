import * as z from "zod";
export const CreateTypeSchema = z.object({
    name: z.string().min(1, {
      message: "Name is required",
    }),
    LicenseType: z.string().min(1, {
      message: "license type is required",
    }),
    amount: z.number().min(0.01, {
      message: "Amount must be greater than 0",
    }),
    type: z.number().min(0.01, {
      message: "type must be greater a number greater than 0",
    }),
    for_company: z.number().min(0, {
      message: "for_company must be greater a number greater than 0",
    }),
    code: z.optional(z.string()),
  });