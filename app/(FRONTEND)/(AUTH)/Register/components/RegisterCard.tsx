"use client";
import { Icons } from "@/components/Icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import UseRegister from "@/app/(FRONTEND)/hooks/use-register";
import { SubmitHandler, useForm } from "react-hook-form";
import z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { regions } from "./regions";

interface RegisterFormProps extends React.HTMLAttributes<HTMLDivElement> {}
export const RegisterSchema = z.object({
  name: z.string(),
  email: z.string(),
  phone_number: z.string(),
  password: z.string(),
  region: z.string(),
  office_location: z.string(),
  fax: z.string(),
  website: z.string(),
  address: z.string(),
  po_box: z.string(),
  confirmPassword: z.string(),
});

export type RegisterDto = z.infer<typeof RegisterSchema>;

const RegisterForm = ({ className, ...props }: RegisterFormProps) => {
  const { isPending: isLoading, registerUser, isError } = UseRegister();

  const form = useForm<RegisterDto>({
    resolver: zodResolver(RegisterSchema),
  });

  const onSubmit: SubmitHandler<RegisterDto> = (data) => {
    registerUser(data);
  };

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-2">
            <div className="grid gap-1">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="eg. Capital Market Security Authority"
                        disabled={isLoading}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="abc@abc.com"
                        disabled={isLoading}
                        type="email"
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Website</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="http://www.abc.com"
                        disabled={isLoading}
                        type="text"
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone_number"
                render={({ field }) => {
                  // State to manage input value
                  const [value, setValue] = useState(field.value || "");

                  const handleChange = (
                    e: React.ChangeEvent<HTMLInputElement>
                  ) => {
                    const inputValue = e.target.value;

                    // Only allow numbers and limit to 9 digits
                    const newValue = inputValue.replace(/\D/g, "").slice(0, 9);

                    // Set the formatted value with the prefix
                    setValue(newValue);
                    field.onChange(`255${newValue}`);
                  };

                  return (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="792041830"
                          value={value}
                          onChange={handleChange}
                          type="text"
                          maxLength={12} // To ensure no more than 12 digits are entered
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={form.control}
                name="fax"
                render={({ field }) => {
                  // State to manage input value
                  const [value, setValue] = useState(field.value || "");

                  const handleChangeFax = (
                    e: React.ChangeEvent<HTMLInputElement>
                  ) => {
                    const inputValue = e.target.value;

                    // Only allow numbers and limit to 9 digits
                    const newValue = inputValue.replace(/\D/g, "").slice(0, 9);

                    // Set the formatted value with the prefix
                    setValue(newValue);
                    field.onChange(`255${newValue}`);
                  };

                  return (
                    <FormItem>
                      <FormLabel>Fax</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="792041830"
                          value={value}
                          onChange={handleChangeFax}
                          type="text"
                          maxLength={12} // To ensure no more than 12 digits are entered
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={form.control}
                name="office_location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>office location</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="1st floor bulding 123"
                        {...field}
                        type="text"
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ali Hassan Mwinyi Road"
                        {...field}
                        type="text"
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="po_box"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>P.o.box</FormLabel>
                    <FormControl>
                      <Input placeholder="12189" {...field} type="text" />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="region"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Region</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={"Select region"}>
                              {regions?.find(
                                (region) => region.value === field.value
                              )?.value ?? "Select region"}
                            </SelectValue>
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {regions?.map((region) => (
                            <SelectItem key={region.value} value={region.value}>
                              {region.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="" disabled={isLoading} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="" disabled={isLoading} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button disabled={isLoading}>
              {isLoading && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              Register
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default RegisterForm;
