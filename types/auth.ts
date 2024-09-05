import * as z from "zod";

export const LoginInputDto = z.object({
  username: z.string().email(),
  password: z.string().min(1, { message: "Password is required" }),
});

export const RegisterInputDto = z.object({
  email: z.string(),
  new_password: z.string().min(4, { message: "Password is required" }),
  first_name: z.string(),
  last_name: z.string().optional(),
});
