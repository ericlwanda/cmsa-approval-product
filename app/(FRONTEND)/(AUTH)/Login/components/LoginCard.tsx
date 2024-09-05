"use client";
import { Icons } from "@/components/Icons";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import z from "zod";
import useAuth from "@/app/(FRONTEND)/hooks/use-auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";


interface LoginFormProps extends React.HTMLAttributes<HTMLDivElement> {}
export const LoginSchema = z.object({
  username: z.string(),
  password: z.string(),
});

export type LoginDto = z.infer<typeof LoginSchema>;



const LoginForm = ({ className, ...props }: LoginFormProps) => {
  const { onSubmit, isLoading } = useAuth();
  const form = useForm<LoginDto>({
    resolver: zodResolver(LoginSchema),
  });
  
  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <Form {...form}>
      <form  onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid gap-2">
          <div className="grid gap-1">

              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="name@example.com"
                        disabled={isLoading}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
          </div>

          <div className="grid gap-1">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        {...field}
                        placeholder=""
                        disabled={isLoading}
                      />
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
            Login
          </Button>
        </div>
      </form>
      </Form>
    </div>
  );
};

export default LoginForm;
