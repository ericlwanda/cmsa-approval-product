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
import { useLicenseTypeFormStore } from "./license-type-form-store";
import { GET, POST, PUT } from "@/lib/client/client";
import { Icons } from "@/components/Icons";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { tokenFromSession } from "@/lib/tokenFromSession";


const LicenseTypeFormSchema = z.object({
  name: z.string(),
});

type LicenseTypeFormValues = z.infer<typeof LicenseTypeFormSchema>;
export default function LicenseTypeForm() {
  const token = tokenFromSession();
  const { editingLicenseType, open, close, create, viewing } = useLicenseTypeFormStore();
  const queryClient = useQueryClient();
  const form = useForm<LicenseTypeFormValues>({
    resolver: zodResolver(LicenseTypeFormSchema),
    defaultValues: {
      name: '',  
    }
  });

  useLicenseTypeFormStore.subscribe((state, _) => {
    if (state.editingLicenseType) {
      form.reset({
        name: state.editingLicenseType.name ?? undefined
      });
    } else {
      form.reset({
        name: undefined
      });
    }
  });

  //query mutation for create
  const {
    mutate: LicenseType,
    isPending,
    error: createError,
    isError: isCreatingError,
    reset: resetCreate,
  } = useMutation({
    mutationFn: (values: LicenseTypeFormValues) => POST("license-type/create", values,token),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["licenseTypes"],
      });
      close();
      //reset form
      form.reset();
      //show notification
      toast({
        title: "Success!",
        description: "LicenseType created successfully",
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
    mutationFn: (values: LicenseTypeFormValues) =>
      PUT(`/license-type/update/${editingLicenseType!.id}`, values,token),
    onSuccess: () => {

      queryClient.invalidateQueries({
        queryKey:["licenseTypes"],
      });
      close();
      //reset form
      form.reset();
      //show notification
      toast({
        title: "Success!",
        description: "product type updated successfully",
      });
    },
  });
  const error = createError as any;
  function onSubmit(data: LicenseTypeFormValues) {
    if (editingLicenseType) {
      update(data);
      return;
    }
    LicenseType(data);
  }
  return (
    <Modal
      Title={viewing ? "View product type" : editingLicenseType ? "Edit product type" : "Create Product type"}
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
                </div>
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
                  >
                    Cancel
                  </Button>

                  <Button type="submit" disabled={isPending || isUpdating}>
                    {(isPending || isUpdating) && (
                      <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                    )}{" "}
                    {editingLicenseType ? "Update" : "Create"}
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
          Create
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
