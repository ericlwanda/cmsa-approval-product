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
// import { UseReportFormStore } from "./report-form-store";
import { tokenFromSession } from "@/lib/tokenFromSession";
import { UseApproveFormStore } from "./approve-form-store";
import userFromSession from "@/lib/userFromSession";
import { useRouter } from "next/navigation";


const ApproveFormSchema = z.object({
  password: z.string()
});

type ApproveFormValues = z.infer<typeof ApproveFormSchema>;

interface ReportFormProps {
  id: string | null; // Prop for application
  isOpen: boolean;
  onClose: () => void; // Prop for closing the modal
}

export default function ApproveForm({ id,isOpen, onClose }: ReportFormProps) {
  const [isModalOpen, setIsModalOpen] = useState(isOpen); 
  const token = tokenFromSession();
  const user = userFromSession();
  const queryClient = useQueryClient();
  const form = useForm<ApproveFormValues>({
    resolver: zodResolver(ApproveFormSchema),
  });
  const router = useRouter();


  UseApproveFormStore.subscribe((state, _) => {

      form.reset({
        password: undefined,
      });

  });

  //query mutation for create
  const {
    mutate: approve,
    isPending,
    error: createError,
    isError: isCreatingError,
    reset: resetCreate,
  } = useMutation({
    mutationFn: (values: ApproveFormValues) =>
      PUT(`application/approve/${id}`, values, token),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["application"],
      });
      setIsModalOpen(false);
      //reset form
      form.reset();
      //show notification
      router.push("/admin/applications");
      
      toast({
        title: "Success!",
        description: "Application approved successfully",
      });
    },
  });

  function onSubmit(data: ApproveFormValues) {
    data.username =user?.email
    approve(data);
  }


  return (
    <Modal
    Title={"Approve Application"}
    Description=""
    content={
      <>
        <h2 className="text-xl font-bold mb-4">
          Please enter your password to approve this request
        </h2>
        <p>Please review the application details before approval.</p>

        {/* zod form */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8"
          >
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
                  setIsModalOpen(false);
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
                Approve
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
