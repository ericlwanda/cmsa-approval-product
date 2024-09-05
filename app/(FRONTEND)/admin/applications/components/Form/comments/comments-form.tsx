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
import { GET, POST, PUT } from "@/lib/client/client";
import { Icons } from "@/components/Icons";
import { Application, IComment } from "@/types/user";
import { useCommentFormStore } from "./comments-form-store";
import userFromSession from "@/lib/userFromSession";
import { tokenFromSession } from "@/lib/tokenFromSession";

const CommentFormSchema = z.object({
  comment: z.string(),
});

interface Props {
  application?: Application;
}

type CommentFormValues = z.infer<typeof CommentFormSchema>;
export default function CommentForm({ application }: Props) {
  const token = tokenFromSession();
  const user = userFromSession();
  const { editingComment, open, close, create, viewing } =
    useCommentFormStore();
  const queryClient = useQueryClient();
  const form = useForm<CommentFormValues>({
    resolver: zodResolver(CommentFormSchema),
    defaultValues: {
      comment: "", // Default value for paymentType
    },
  });

  useCommentFormStore.subscribe((state, _) => {

      form.reset({
        comment: undefined,
      });
  
  });

  const {
    mutate: comment,
    isPending: pendingComment,
    error: commentError,
    isError: isCommentingError,
  } = useMutation({
    mutationFn: (values: CommentFormValues) =>
      POST(`application/comment/${application?.id}`, values,token),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["applicationsView"],
      });
      close();
      //reset form
      form.reset();
      //show notification
      toast({
        title: "Success!",
        description: "Success",
      });

    },
  });

  const error = commentError as any;
  const onSubmitComment = (data: CommentFormValues) => {
    console.log("data", data);
    const newComment: IComment = {
      id: user?.id ?? "", // Ensure the user ID is properly assigned or fallback to an empty string
      comment: data.comment,
    };
    comment(newComment);
  };

  return (
    <Modal
      Title={
        "Add Memo"
      }
      Description=""
      content={
        <>
          {/* zod form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmitComment)} className="space-y-3">
              <div className=" flex flex-row  w-full space-x-3">
                <div className=" flex flex-col gap-3 w-full">

                  <FormField
                    control={form.control}
                    name="comment"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Info
                            <span className=" text-destructive"> * </span>

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
                    disabled={pendingComment}
                  >
                    Cancel
                  </Button>

                  <Button type="submit" disabled={pendingComment}>
                    {pendingComment && (
                      <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                    )}{" "}
                    {editingComment ? "Update" : "Save"}
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
          className="px-2 py-1"
        >
          Add Memo
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
