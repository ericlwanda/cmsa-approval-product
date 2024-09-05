import * as z from "zod";
export const CreateSchema = z.object({
    email: z.string().email({
      message: "Valid email is required",
    }).min(3, {
      message: "Email is required",
    }),
    password: z.string().min(6, {
      message: "Password Minimum 6 characters required",
    }).min(3, {
      message: "Password is required",
    }),
    name: z.string().min(1, {
      message: "Name is required",
    }),
    role: z.string().min(1, {
      message: "Role is required",
    }),
    phone_number: z.string().max(14, {
      message: 'Phone number must not exceed 14 characters'
    }).min(10, {
      message: "Phone number should be at least 10 characters",
    }),
    code: z.optional(z.string()),
  });

  export const UpdateSchema = z.object({
    name: z.string().min(1, {
      message: "Name is required",
    }),
    role: z.string().min(1, {
      message: "Role is required",
    }),
    phone_number: z.string().max(14, {
      message: 'Phone number must not exceed 14 characters'
    }).min(10, {
      message: "Phone number should be at least 10 characters",
    }),
    code: z.optional(z.string()),
  });


  export const UpdateRoleSchema = z.object({

    role: z.string().min(1, {
      message: "Role is required",
    }),
 
    code: z.optional(z.string()),
  });

  export const ResetPasswordSchema = z.object({
    
    phone_number: z.string().min(1, {
      message: "phone number required",
    }),
 
    code: z.optional(z.string()),
  });


  export const UpdateStoreSchema = z.object({
    email: z.string().email({
      message: "Valid email is required",
    }).min(3, {
      message: "Email is required",
    }),
    name: z.string().min(1, {
      message: "Name is required",
    }),
    role: z.string().min(1, {
      message: "Role is required",
    }),
    phone_number: z.string().max(14, {
      message: 'Phone number must not exceed 14 characters'
    }).min(10, {
      message: "Phone number should be at least 10 characters",
    }),
    location: z.string().optional(),
    stores: z.array(z.string().min(1, "Store Id is required")).nonempty({
        message: "At least one Store is required"
      }),
    code: z.optional(z.string()),
  });

  export const ChangePasswordSchema = z.object({
    
    oldPassword: z.string().min(6, {
      message: "Minimum 6 characters required",
    }).min(3, {
      message: "Password is required",
    }),

    newPassword: z.string().min(6, {
      message: "Minimum 6 characters required",
    }).min(3, {
      message: "Password is required",
    }),

    confirmPassword: z.string().min(6, {
      message: "Minimum 6 characters required",
    }).min(3, {
      message: "Password is required",
    }),
 
    code: z.optional(z.string()),
  });