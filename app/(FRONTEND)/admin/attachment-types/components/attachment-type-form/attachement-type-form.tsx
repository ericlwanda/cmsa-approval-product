import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import React, { useState, useEffect } from "react";
import { Editor } from "react-draft-wysiwyg"; 
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css"; 
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
import { useForm } from "react-hook-form";
import z from "zod";
import { useAttachmentTypeFormStore } from "./attachment-type-form-store";
import { POST, PUT } from "@/lib/client/client";
import { tokenFromSession } from "@/lib/tokenFromSession";
import { LicenseTypeSelect } from "@/components/selectors/licenseIdSelector";
import { convertToRaw, EditorState, ContentState } from "draft-js";
import { Icons } from "@/components/Icons";

const AttachmentTypeFormSchema = z.object({
  name: z.string(),
  LicenseType: z.string(),
});

type AttachmentTypeFormValues = z.infer<typeof AttachmentTypeFormSchema>;

interface Props {
  licenseTypeId?: string;
}

export default function AttachmentTypeForm({licenseTypeId}:Props) {
  const token = tokenFromSession();
  const { editingAttachmentType, open, close, create, viewing } = useAttachmentTypeFormStore();
  const queryClient = useQueryClient();
  const [editorState, setEditorState] = useState(EditorState.createEmpty()); 

  const form = useForm<AttachmentTypeFormValues>({
    resolver: zodResolver(AttachmentTypeFormSchema),
    defaultValues: {
      name: "",
      LicenseType: ""
    },
  });

  useAttachmentTypeFormStore.subscribe((state, _) => {
    if (state.editingAttachmentType) {
      form.reset({
        name: state.editingAttachmentType.name ?? undefined,
        LicenseType:state.editingAttachmentType.license_types.id ?? undefined
      });
    } else {
      form.reset({
        name: undefined,
        LicenseType:licenseTypeId ?? undefined
      });
    }
  });

  const {
    mutate: AttachmentType,
    isPending,
  } = useMutation({
    mutationFn: (values: AttachmentTypeFormValues) => POST("attachment-type/create", { 
      ...values
    }, token),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["attachmentTypes"],
      });
      close();
      form.reset();
      toast({
        title: "Success!",
        description: "Attachment Type created successfully",
      });
    },
  });

  const {
    mutate: update,
    isPending:isUpdating,
  } = useMutation({
    mutationFn: (values: AttachmentTypeFormValues) =>
      PUT(`/attachment-type/update/${editingAttachmentType!.id}`, { 
        ...values, 
      }, token),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["attachmentTypes"],
      });
      close();
      form.reset();
      toast({
        title: "Success!",
        description: "Attachment Type updated successfully",
      });
    },
  });

  function onSubmit(data: AttachmentTypeFormValues) {
    data.LicenseType = licenseTypeId??'';
    if (editingAttachmentType) {
      update(data);
      return;
    }
    AttachmentType(data);
  }

  // Handle editor state change
  const handleEditorStateChange = (state: EditorState) => {
    setEditorState(state);
    const content = state.getCurrentContent();
    const plainText = content.getPlainText(); // Get plain text to update the form field
    form.setValue("name", plainText); // Update form state with the plain text
  };

  return (
    <Modal
      Title={viewing ? "View AttachmentType" : editingAttachmentType ? "Edit AttachmentType" : "Create AttachmentType"}
      Description=""
      content={
        <>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
              <div className="flex flex-row w-full space-x-3">
                <div className="flex flex-col gap-3 w-full">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Name
                          {!viewing && (
                            <span className="text-destructive"> * </span>
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
                    {editingAttachmentType ? "Update" : "Create"}
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
          Create AttachmentType
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
