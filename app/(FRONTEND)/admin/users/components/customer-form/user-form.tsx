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
import Modal from "@/lib/services/Modal";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { useUserFormStore } from "./user-form-store";
import { GET, POST, PUT } from "@/lib/client/client";
import { Icons } from "@/components/Icons";
import { RoleSelect } from "@/components/selectors/RoleSelectors";
import { tokenFromSession } from "@/lib/tokenFromSession";


const customerFormSchema = z.object({
  name: z.string(),
  role: z.string(),
  password: z.string().optional(),
  phone_number: z.string().optional(),
  email: z.string().email(),
});

type CustomerFormValues = z.infer<typeof customerFormSchema>;
export default function UserForm() {
  const token = tokenFromSession();
  const { editingUser, open, close, create, viewing } = useUserFormStore();
  const queryClient = useQueryClient();
  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(customerFormSchema),
  });

  useUserFormStore.subscribe((state, _) => {
    if (state.editingUser) {
      form.reset({
        name: state.editingUser.name ?? undefined,
        email: state.editingUser.email ?? undefined,
        role: state.editingUser.role ?? undefined,
        phone_number: state.editingUser.phone_number ?? undefined,
      });
    } else {
      form.reset({
        name: undefined,
        email: undefined,
        role: undefined,
        phone_number: undefined,
      });
    }
  });

  //query mutation for create
  const {
    mutate: customer,
    isPending,
    error: createError,
    isError: isCreatingError,
    reset: resetCreate,
  } = useMutation({
    mutationFn: (values: CustomerFormValues) => POST("user/create", values,token),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
      close();
      //reset form
      form.reset();
      //show notification
      toast({
        title: "Success!",
        description: "User created successfully",
      });
    },
  });

  //query mutation for update
  const {
    mutate: update,
    isPending: isUpdating,
    error: updateError,
    isError: isUpdatingError,
    reset: resetUpdate,
  } = useMutation({
    mutationFn: (values: CustomerFormValues) =>
      PUT(`/user/update-info/${editingUser!.id}`, values,token),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
      close();
      //reset form
      form.reset();
      //show notification
      toast({
        title: "Success!",
        description: "User updated successfully",
      });
    },
  });
  const error = createError as any;
  function onSubmit(data: CustomerFormValues) {
    if (editingUser) {
      update(data);
      return;
    }
    customer(data);
  }
  return (
    <Modal
      Title={viewing ? "View User" : editingUser ? "Edit User" : "Create User"}
      Description=""
      content={
        <>
          {/* zod form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
              <div className=" flex flex-row  w-full space-x-3">
                <div className=" flex flex-col gap-3 w-full">
                  
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            name
                            {!viewing && (
                              <span className=" text-destructive"> * </span>
                            )}
                          </FormLabel>
                          <FormControl>
                            <Input
                              className=""
                              disabled={viewing}
                              placeholder="Name"
                              {...field}
                            />
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                 
                  {!(editingUser && !viewing) && (
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Email
                          {!viewing && (
                            <span className=" text-destructive"> * </span>
                          )}
                        </FormLabel>
                        <FormControl>
                          <Input
                            disabled={viewing}
                            placeholder="Email"
                            {...field}
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                </div>
              </div>
<div>
                {!editingUser && (
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            disabled={viewing}
                            placeholder="Password"
                            {...field}
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
               
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <FormControl>
                        <RoleSelect
                          placeholder="Select a role"
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input
                          disabled={viewing}
                          placeholder="255** *** ***"
                          {...field}
                          type="number"
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {!viewing && (
                <DialogFooter>
                  <Button
                    variant="secondary"
                    onClick={(e) => {
                      e.preventDefault();
                      close();
                      form.reset();
                    }}

                    disabled={isPending || isUpdating}
                  >
                    Cancel
                  </Button>

                  <Button type="submit" disabled={isPending || isUpdating}>
                    {(isPending || isUpdating) && (
                      <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                    )}{" "}
                    {editingUser ? "Update" : "Create"}
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
