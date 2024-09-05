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
import Modal from "@/lib/services/Modal";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { GET, POST, PUT } from "@/lib/client/client";
import { Icons } from "@/components/Icons";
import { Application, IAdditionals } from "@/types/user";
import { useAdditionalFormStore } from "./additional-form-store";
import userFromSession from "@/lib/userFromSession";
import { tokenFromSession } from "@/lib/tokenFromSession";

const AdditionalFormSchema = z.object({
  info: z.string(),
});

interface Props {
  application?: Application;
}

interface AdditionalFormProps {
  id: string | null;
  attachmentId:string | null; // Prop for attachment ID
  isOpen: boolean;
  onClose: () => void; // Prop for closing the modal
}

type AdditionalFormValues = z.infer<typeof AdditionalFormSchema>;
export default function AdditionalForm({ id,isOpen, onClose,attachmentId }: AdditionalFormProps) {
  const [isModalOpen, setIsModalOpen] = useState(isOpen); 
  const user = userFromSession();
  const token = tokenFromSession();
  const { editingAdditional, open, close, create, viewing } =
    useAdditionalFormStore();
  const queryClient = useQueryClient();
  const form = useForm<AdditionalFormValues>({
    resolver: zodResolver(AdditionalFormSchema),
    defaultValues: {
      info: "", // Default value for paymentType
    },
  });

  useAdditionalFormStore.subscribe((state, _) => {

      form.reset({
        info: undefined,
      });
  
  });

  //query mutation for create
  const {
    mutate: Additional,
    isPending,
    error: createError,
    isError: isCreatingError,
    reset: resetCreate,
  } = useMutation({
    mutationFn: (values: AdditionalFormValues) =>
      POST(`application/additional/${id}`, values,token),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["applicationsView"],
      });
      setIsModalOpen(false)
      updateComplianceStatus(attachmentId || "", "not complied");
      //reset form
      form.reset();
      //show notification
      toast({
        title: "Success!",
        description: "Success",
      });
    },
  });

  const updateComplianceStatus = async (attachmentId: string, status: string, additionalInfo?: string) => {
    try {
      await POST(`application/update-compliance/${attachmentId}`, { complianceStatus: status, additionalInfo }, token);
      queryClient.invalidateQueries({ queryKey: ["applicationsView"] });
      toast({ title: "Compliance Status Updated", description: `Compliance status updated` });
    } catch (error) {
      toast({ title: "Error updating compliance status", description: "An error occurred while updating the compliance status.", variant: "destructive" });
    }
  };

  const error = createError as any;
  function onSubmit(data: AdditionalFormValues) {
    const newAdditional: IAdditionals = {
      id: user?.id ?? "", // Ensure the user ID is properly assigned or fallback to an empty string
      info: data.info,
    };
  Additional(newAdditional);
  }


  return (
    <Modal
      Title={
        "More info"
      }
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
                    name="info"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Info
                          {!viewing && (
                            <span className=" text-destructive"> * </span>
                          )}
                        </FormLabel>
                        <FormControl>
                        <textarea
                                {...field}
                                placeholder="Enter your recommendations here."
                                className="textArea"
                                disabled={viewing}
                                rows={4}
                                cols={50}
                              />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />

                </div>
              </div>

              
                <DialogFooter>
                  <Button
                    variant="secondary"
                    onClick={(e) => {
                      e.preventDefault();
                      setIsModalOpen(false)
                      form.reset();
                    }}
                    disabled={isPending}
                  >
                    Cancel
                  </Button>

                  <Button type="submit" disabled={isPending}>
                    {isPending && (
                      <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                    )}{" "}
                    {editingAdditional ? "Update" : "Create"}
                  </Button>
                </DialogFooter>
            
            </form>
          </Form>
        </>
      }

      opened={isModalOpen}
      onChange={onClose}
    />
  );
}
