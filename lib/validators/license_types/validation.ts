import * as z from "zod";
export const CreateTypeSchema = z.object({
    name: z.string().min(1, {
      message: "Name is required",
    }),
    code: z.optional(z.string()),
  });