// import { Button } from "@/components/ui/button";
// import { DialogFooter } from "@/components/ui/dialog";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { toast } from "@/components/ui/use-toast";
// import Modal from "@/lib/services/Modal";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import React from "react";
// import { useForm } from "react-hook-form";
// import z from "zod";
// import { usePaymentFormStore } from"@/app/(FRONTEND)/admin/applications/components/Form/payment/payment-form-store";
// import { POST} from "@/lib/client/client";
// import { Icons } from "@/components/Icons";

// import { PaymentTypeSelect } from "@/components/selectors/paymentTypeSelector";
// import { Application } from "@/types/user";
// import { tokenFromSession } from "@/lib/tokenFromSession";

// const PaymentFormSchema = z.object({
//   paymentType: z.string(),
//   description: z.string(),
//   quantity: z.number().int(),
//   amount: z.number().int(),
// });

// interface Props {
//   application?: Application;
// }

// type PaymentFormValues = z.infer<typeof PaymentFormSchema>;
// export default function PaymentForm({ application }: Props) {
//   const token = tokenFromSession();
//   const { editingPayment, open, close, create, viewing } =
//     usePaymentFormStore();
//   const queryClient = useQueryClient();
//   const form = useForm<PaymentFormValues>({
//     resolver: zodResolver(PaymentFormSchema),
//     defaultValues: {
//       paymentType: "", // Default value for paymentType
//       description: "", // Default value for description
//       quantity: 0, // Default value for quantity (numeric type)
//       amount: 0, // Default value for amount (numeric type)
//     },
//   });

//   usePaymentFormStore.subscribe((state, _) => {
//     if (state.editingPayment) {
//       form.reset({
//         description: state.editingPayment.description ?? undefined,
//         paymentType: state?.editingPayment?.payment_type_id ?? undefined,
//         quantity: state?.editingPayment?.quantity ?? undefined,
//         amount: state?.editingPayment?.amount ?? undefined,
//       });
//     } else {
//       form.reset({
//         description: undefined,
//         paymentType: undefined,
//         quantity: undefined,
//         amount: undefined,
//       });
//     }
//   });

//   //query mutation for create
//   const {
//     mutate: Payment,
//     isPending,
//     error: createError,
//     isError: isCreatingError,
//     reset: resetCreate,
//   } = useMutation({
//     mutationFn: (values: PaymentFormValues) =>
//       POST(`payment/create/${application?.id}`, values,token),
//     onSuccess: () => {
//       queryClient.invalidateQueries({
//         queryKey: ["payments"],
//       });
//       close();
//       //reset form
//       form.reset();
//       //show notification
//       toast({
//         title: "Success!",
//         description: "Payment Type created successfully",
//       });
//     },
//   });

//   const error = createError as any;
//   function onSubmit(data: PaymentFormValues) {
//     Payment(data);
//   }
//   return (
//     <Modal
//       Title={
//         viewing
//           ? "View Payment"
//           : editingPayment
//           ? "Edit Payment"
//           : "Create Payment"
//       }
//       Description=""
//       content={
//         <>
//           {/* zod form */}
//           <Form {...form}>
//             <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
//               <div className=" flex flex-row  w-full space-x-3">
//                 <div className=" flex flex-col gap-3 w-full">
//                   <FormField
//                     control={form.control}
//                     name="paymentType"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>Payment Type</FormLabel>
//                         <FormControl>
//                           <PaymentTypeSelect
//                             placeholder="Select a payment type"
//                             value={field.value}
//                             onChange={field.onChange}
//                           />
//                         </FormControl>

//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />

//                   <FormField
//                     control={form.control}
//                     name="description"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>
//                           Description
//                           {!viewing && (
//                             <span className=" text-destructive"> * </span>
//                           )}
//                         </FormLabel>
//                         <FormControl>
//                           <Input
//                             className=""
//                             disabled={viewing}
//                             placeholder="Description"
//                             {...field}
//                           />
//                         </FormControl>

//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />

//                   <FormField
//                     control={form.control}
//                     name="quantity"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>
//                           Quantity
//                           {!viewing && (
//                             <span className=" text-destructive"> * </span>
//                           )}
//                         </FormLabel>
//                         <FormControl>
//                           <Input
//                             type="number"
//                             className=""
//                             disabled={viewing}
//                             placeholder="Quantity"
//                             {...field}
//                             value={
//                               field.value !== undefined
//                                 ? Number(field.value)
//                                 : ""
//                             }
//                             onChange={(e) => {
//                               const value = e.target.value
//                                 ? Number(e.target.value)
//                                 : "";
//                               field.onChange(value);
//                             }}
//                           />
//                         </FormControl>

//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />

//                   <FormField
//                     control={form.control}
//                     name="amount"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>
//                           Amount
//                           {!viewing && (
//                             <span className=" text-destructive"> * </span>
//                           )}
//                         </FormLabel>
//                         <FormControl>
//                           <Input
//                             type="number"
//                             className=""
//                             disabled={viewing}
//                             placeholder="Amount"
//                             {...field}
//                             value={
//                               field.value !== undefined
//                                 ? Number(field.value)
//                                 : ""
//                             }
//                             onChange={(e) => {
//                               const value = e.target.value
//                                 ? Number(e.target.value)
//                                 : "";
//                               field.onChange(value);
//                             }}
//                           />
//                         </FormControl>

//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />
//                 </div>
//               </div>

//               {!viewing && (
//                 <DialogFooter>
//                   <Button
//                     variant="secondary"
//                     onClick={(e) => {
//                       e.preventDefault();
//                       close();
//                       form.reset();
//                     }}
//                   >
//                     Cancel
//                   </Button>

//                   <Button type="submit" disabled={isPending}>
//                     {isPending && (
//                       <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
//                     )}{" "}
//                     {editingPayment ? "Update" : "Create"}
//                   </Button>
//                 </DialogFooter>
//               )}
//             </form>
//           </Form>
//         </>
//       }
//       triggerButton={
//         <Button
//           onClick={() => {
//             create();
//             form.reset();
//           }}
//           size="sm"
//         >
//           Create Payment
//         </Button>
//       }
//       opened={open}
//       onChange={() => {
//         if (open) {
//           close();
//         } else {
//           form.reset();
//         }
//       }}
//     />
//   );
// }
