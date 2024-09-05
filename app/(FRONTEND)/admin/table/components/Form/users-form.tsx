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
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { UseUsersFormStore } from "./users-form-store";
import Modal from "@/lib/services/Modal";

const UserFormSchema = z.object({
  firstname: z.string().optional(),
  lastname: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
});

type UserFormValues = z.infer<typeof UserFormSchema>;
export default function UsersForm() {
  const { editingUsers, open, close, create, viewing } = UseUsersFormStore();

  const form = useForm<UserFormValues>({
    resolver: zodResolver(UserFormSchema),
  });

  UseUsersFormStore.subscribe((state, _) => {
    if (state.editingUsers) {
      form.reset({
        firstname: state?.editingUsers?.name.firstName ?? undefined,
        lastname: state?.editingUsers?.name.lastName ?? undefined,
        address: state?.editingUsers?.address ?? undefined,
        city: state?.editingUsers?.city ?? undefined,
        state: state?.editingUsers?.state ?? undefined,
      });
    } else {
      form.reset({
        firstname: undefined,
        address: undefined,
        city: undefined,
        state: "",
      });
    }
  });

  //query mutation for create

  //query mutation for update

  function onSubmit(data: UserFormValues) {
    toast({
      title: "Success!",
      description: "User created successfully",
    });
  }
  return (
    <Modal
      Title={
        viewing ? "View Users" : editingUsers ? "Edit Users" : "Create User"
      }
      Description=""
      content={
        <>
          {/* zod form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="firstname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      First Name{" "}
                      {!viewing && (
                        <span className=" text-destructive"> * </span>
                      )}
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={viewing}
                        placeholder="First Name"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Last Name{" "}
                      {!viewing && (
                        <span className=" text-destructive"> * </span>
                      )}
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={viewing}
                        placeholder="Last Name"
                        {...field}
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
                    <FormLabel>
                      Address{" "}
                      {!viewing && (
                        <span className=" text-destructive"> * </span>
                      )}
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={viewing}
                        placeholder="Address"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Address{" "}
                      {!viewing && (
                        <span className=" text-destructive"> * </span>
                      )}
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={viewing}
                        placeholder="Address"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State</FormLabel>
                    <FormControl>
                      <Input
                        disabled={viewing}
                        placeholder="State"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              {!viewing && (
                <DialogFooter>
                  <Button
                    variant="secondary"
                    onClick={(e) => {
                      e.preventDefault();
                      close();
                      form.reset();
                    }}
                  >
                    Cancel
                  </Button>

                  <Button type="submit">
                    {editingUsers ? "Update" : "Create"}
                  </Button>
                </DialogFooter>
              )}
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
          Create User
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
