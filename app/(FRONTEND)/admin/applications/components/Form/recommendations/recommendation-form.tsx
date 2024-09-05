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
import { Application, IRecommendation } from "@/types/user";
import { useRecommendationFormStore } from "./recommendation-form-store";
import userFromSession from "@/lib/userFromSession";
import { tokenFromSession } from "@/lib/tokenFromSession";

const RecommendationFormSchema = z.object({
  recommendation: z.string(),
});

interface Props {
  application?: Application;
}

type RecommendationFormValues = z.infer<typeof RecommendationFormSchema>;
export default function RecommendationForm({ application }: Props) {
  const token = tokenFromSession();
  const user = userFromSession();
  const { editingRecommendation, open, close, create, viewing } =
    useRecommendationFormStore();
  const queryClient = useQueryClient();
  const form = useForm<RecommendationFormValues>({
    resolver: zodResolver(RecommendationFormSchema),
    defaultValues: {
      recommendation: "", // Default value for paymentType
    },
  });

  useRecommendationFormStore.subscribe((state, _) => {
    if (state.editingRecommendation) {
      form.reset({
        recommendation: state.editingRecommendation.recommendation ?? undefined,
      });
    } else {
      form.reset({
        recommendation: undefined,
      });
    }
  });

  const {
    mutate: Recommendation,
    isPending: pendingRecommendation,
    error: RecommendationError,
    isError: isRecommendationingError,
  } = useMutation({
    mutationFn: (values: RecommendationFormValues) =>
      POST(`application/recommendation/${application?.id}`, values,token),
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
    onError:()=>{
      close();
      //reset form
      form.reset();
      //show notification
    }
  });

  const error = RecommendationError as any;
  const onSubmitRecommendation = (data: RecommendationFormValues) => {
    console.log("data", data);
    const newRecommendation: IRecommendation = {
      id: user?.id ?? "", // Ensure the user ID is properly assigned or fallback to an empty string
      recommendation: data.recommendation,
    };
    Recommendation(newRecommendation);
  };

  return (
    <Modal
      Title={
        viewing
          ? "View Recommendation"
          : editingRecommendation
          ? "Edit Recommendation"
          : "Approval Recommendation"
      }
      Description=""
      content={
        <>
          {/* zod form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmitRecommendation)} className="space-y-3">
              <div className=" flex flex-row  w-full space-x-3">
                <div className=" flex flex-col gap-3 w-full">
                  <FormField
                    control={form.control}
                    name="recommendation"
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

              {!viewing && (
                <DialogFooter>
                  <Button
                    variant="secondary"
                    onClick={(e) => {
                      e.preventDefault();
                      close();
                      form.reset();
                    }}
                    disabled={pendingRecommendation}
                  >
                    Cancel
                  </Button>

                  <Button  type="submit"  disabled={pendingRecommendation}>
                    {pendingRecommendation && (
                      <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                    )}{" "}
                    {editingRecommendation ? "Update" : "Save"}
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
          className="bg-blue-600 text-white hover:bg-bluew-700"
        >
          Add Recommendation
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
