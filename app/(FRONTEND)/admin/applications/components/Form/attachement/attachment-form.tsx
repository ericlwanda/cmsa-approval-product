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
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import Modal from "@/lib/services/Modal";
import { POST, PUT } from "@/lib/client/client";
import { Icons } from "@/components/Icons";
import { UseAttachmentsFormStore } from "./attachment-form-store";
import { tokenFromSession } from "@/lib/tokenFromSession";


const AttachmentFormSchema = z.object({
  file: z.string(),
});

type AttachmentFormValues = z.infer<typeof AttachmentFormSchema>;

interface AttachmentFormProps {
  id: string | null; // Prop for attachment ID
  isOpen: boolean;
  onClose: () => void; // Prop for closing the modal
}

export default function AttachmentForm({ id,isOpen, onClose }: AttachmentFormProps) {
  const [isModalOpen, setIsModalOpen] = useState(isOpen); 
  const token = tokenFromSession();

  const queryClient = useQueryClient();
  const form = useForm<AttachmentFormValues>({
    resolver: zodResolver(AttachmentFormSchema),
  });

  UseAttachmentsFormStore.subscribe((state, _) => {

      form.reset({
        file: undefined,
      });

  });

  //query mutation for create
  const {
    mutate: attach,
    isPending,
    error: createError,
    isError: isCreatingError,
    reset: resetCreate,
  } = useMutation({
    mutationFn: (values: AttachmentFormValues) =>
      POST(`attachments/add-attachments/${id}`, values, token),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["applicationsConfirm"],
      });
      setIsModalOpen(false)
      
      //reset form
      form.reset();
      //show notification
      toast({
        title: "Success!",
        description: "Attachment added successfully",
      });
    },
  });

  function onSubmit(data: AttachmentFormValues) {
    attach(data);
  }

  const handleFileChange = (event: any, field: any) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result?.toString().split(",")[1];
      form.setValue(field, base64String);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  return (
    <Modal
      Title={
           "Add Attachment"
      }
      Description=""
      content={
        <>
          {/* zod form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="file"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Attachment File</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept=".pdf"
                        onChange={(e) => handleFileChange(e, "file")}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

             
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
                    )}
                   Add
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
