import * as z from "zod";

export const LoginSchema = z.object({
    username: z.string().email({
      message: "Email is required",
    }),
    password: z.string().min(1, {
      message: "Password is required",
    }),
    code: z.optional(z.string()),
  });
  


  export const RegisterSchema = z.object({
    email: z.string().email({
      message: "Valid email is required",
    }).min(3, {
      message: "Email is required",
    }),
    password: z.string().min(6, {
      message: "Minimum 6 characters required",
    }).min(3, {
      message: "Password is required",
    }),
    confirmPassword: z.string().min(6, {
      message: "Minimum 6 characters required",
    }).min(3, {
      message: "Password is required",
    }),
    name: z.string().min(1, {
      message: "Name is required",
    }),
    phone_number: z.string().max(14, {
      message: 'Phone number must not exceed 14 characters'
    }).min(10, {
      message: "Phone number should be at least 10 characters",
    }),
    
    office_location: z.string().min(1, {
      message: "Office location is required",
    }),
    address: z.string().min(1, {
      message: "Address is required",
    }),
    region: z.string().min(1, {
      message: "Region is required",
    }),
    po_box: z.string().min(1, {
      message: "PO Box is required",
    }),
    website: z.string().min(1,{
      message: "Invalid URL",
    }),
    fax: z.string().max(14, {
      message: 'Company fax number must not exceed 14 characters',
    }),

    code: z.optional(z.string()),
  });
  

