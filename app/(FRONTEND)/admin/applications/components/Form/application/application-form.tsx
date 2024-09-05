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
import { toast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import z from "zod";
import { UseApplicationsFormStore } from "./application-form-store";
import Modal from "@/lib/services/Modal";
import { POST, PUT } from "@/lib/client/client";
import { LicenseTypeSelect } from "@/components/selectors/licenseIdSelector";
import { tokenFromSession } from "@/lib/tokenFromSession";
import { Icons } from "@/components/Icons";
import { Input } from "@/components/ui/input";

const ApplicationFormSchema = z.object({
  licenseType: z.string(),
  marketValueAmount: z.number(),
});

type ApplicationFormValues = z.infer<typeof ApplicationFormSchema>;

export default function ApplicationForm() {
  const token = tokenFromSession();
  const { editingApplication, open, close, create, viewing } =
    UseApplicationsFormStore();
  const queryClient = useQueryClient();

  const form = useForm<ApplicationFormValues>({
    resolver: zodResolver(ApplicationFormSchema),
    defaultValues: {
      marketValueAmount: 0,
    },
  });

  UseApplicationsFormStore.subscribe((state, _) => {
    if (state.editingApplication) {
      form.reset({
        licenseType: state?.editingApplication?.license_type_id ?? "",
        marketValueAmount: parseInt(state?.editingApplication?.marketValue) ?? [""],
      });
    } else {
      form.reset({
        licenseType: "",
        marketValueAmount: 0,
      });
    }
  });

  const {
    mutate: apply,
    isPending,
    error: createError,
    isError: isCreatingError,
    reset: resetCreate,
  } = useMutation({
    mutationFn: (values: ApplicationFormValues) =>
      POST(`application/create`, values, token),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["applications"],
      });
      close();
      form.reset();
      toast({
        title: "Success!",
        description: "Application created successfully",
      });
    },
  });

  const {
    mutate: update,
    isPending: isUpdating,
    error: updateError,
    isError: isUpdatingError,
    reset: resetUpdate,
  } = useMutation({
    mutationFn: (values: ApplicationFormValues) =>
      PUT(`/application/update/${editingApplication!.id}`, values, token),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["applications"],
      });
      close();
      form.reset();
      toast({
        title: "Success!",
        description: "Application updated successfully",
      });
    },
  });

  function onSubmit(data: ApplicationFormValues) {
    if (editingApplication) {
      update(data);
      return;
    }
    apply(data);
  }

  return (
    <Modal
      Title={
        viewing
          ? "View Application"
          : editingApplication
          ? "Edit Application"
          : "Create Application"
      }
      Description=""
      content={
        <>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="licenseType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>License Type</FormLabel>
                    <FormControl>
                      <LicenseTypeSelect
                        placeholder="Select a license type"
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
                name="marketValueAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Market value share(TSH )
                      {!viewing && (
                        <span className=" text-destructive"> * </span>
                      )}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        className=""
                        disabled={viewing}
                        {...field}
                        value={
                          field.value !== undefined ? Number(field.value) : ""
                        }
                        onChange={(e) => {
                          const value = e.target.value
                            ? Number(e.target.value)
                            : "";
                          field.onChange(value);
                        }}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              {!viewing && (
                <DialogFooter>
                  <Button
                    variant="destructive"
                    onClick={(e) => {
                      e.preventDefault();
                      close();
                      form.reset();
                    }}
                    disabled={isPending || isUpdating}
                  >
                    Cancel
                  </Button>

                  <Button type="submit">
                    {(isPending || isUpdating) && (
                      <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                    )}{" "}
                    {editingApplication ? "Update" : "Create"}
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
          New Application
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
