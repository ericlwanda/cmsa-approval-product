"use client";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { User } from "@/types/user";
import userFromSession from "@/lib/userFromSession";
import { GET, POST } from "@/lib/client/client";
import { Icons } from "@/components/Icons";
import { tokenFromSession } from "@/lib/tokenFromSession";

const profileFormSchema = z.object({
  oldPassword: z.string(),
  newPassword: z.string(),
  confirmPassword: z.string(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function ProfileForm() {
  const token = tokenFromSession();
  const user = userFromSession();
  // const queryClient = useQueryClient();

  //query to get current user

  // const {
  //   data: queryUser,
  //   isLoading: getUserLoding,
  //   isError: getUserError,
  // } = useQuery<User>({
  //   queryKey: ["user", user?.id],
  //   queryFn: () => GET(`/user/${user?.id}`),
  //   enabled: !!user?.id,
  // });

  //query mutation for update
  const { mutate: update, isPending } = useMutation({
    mutationFn: (values: ProfileFormValues) =>
      POST(`/user/change-password/${user?.id}`, values,token),
    onSuccess: (res) => {
      //update profile local storage
      //show notification
      toast({
        title: "Success!",
        description: "Password updated successfully",
      });
    },
  });

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    values: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });
  function onSubmit(data: ProfileFormValues) {
    update(data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="oldPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Old Password</FormLabel>
              <FormControl>
                <Input placeholder="Old Password" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New Password</FormLabel>
              <FormControl>
                <Input placeholder="Password" {...field} />
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
                <Input placeholder="Confirm Password" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isPending}>
          {isPending && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}{" "}
          Change Password
        </Button>
      </form>
    </Form>
  );
}
