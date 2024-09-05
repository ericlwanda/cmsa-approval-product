import UseApplication from "@/app/(FRONTEND)/hooks/use-application";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { GET, POST } from "@/lib/client/client";
import userFromSession from "@/lib/userFromSession";
import { Application, IAsignees, IUser } from "@/types/user";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import Select from "react-select";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Form } from "@/components/ui/form";
import { Icons } from "@/components/Icons";
import AdditionalForm from "./Form/additional/additional-form";
import CommentForm from "./Form/comments/comments-form";
import RecommendationForm from "./Form/recommendations/recommendation-form";
import { useRouter } from "next/navigation";
import { tokenFromSession } from "@/lib/tokenFromSession";
import { ApplicationStatus, PaymentStatus, Role } from "@/lib/enums/enums";
import { formatCurrency } from "@/lib/utils";
interface Props {
  application?: Application;
}

const AssigneeFormSchema = z.object({
  assignees: z
    .array(
      z.object({
        id: z.string(),
      })
    )
    .min(1, "Assignee is required"),
});

type AssigneeFormValues = z.infer<typeof AssigneeFormSchema>;
const ResponsesPage = ({ application }: Props) => {
  const token = tokenFromSession();
  const user = userFromSession();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [users, setUsers] = useState<IUser[]>([]);
  const [assigneesValues, setAssigneesValues] = useState<IAsignees[]>([]);
  const [status, setStatus] = useState<string>(application?.status ?? "");
  const [attachmentId, setAttachmentId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setAttachmentId(null); // Reset the attachment ID when closing the modal
  };

  const handleComplianceChange = (attachmentId: string, status: string) => {
    if (status === "not complied") {
      setAttachmentId(attachmentId); // Store the attachment ID
      setIsModalOpen(true); // Open the modal
    } else {
      // Update compliance status directly for "complied"
      updateComplianceStatus(attachmentId, status);
    }
  };

  const updateComplianceStatus = async (
    attachmentId: string,
    status: string,
    additionalInfo?: string
  ) => {
    try {
      await POST(
        `application/update-compliance/${attachmentId}`,
        { complianceStatus: status, additionalInfo },
        token
      );
      queryClient.invalidateQueries({ queryKey: ["applicationsView"] });
      toast({
        title: "Compliance Status Updated",
        description: `Compliance status updated`,
      });
    } catch (error) {
      toast({
        title: "Error updating compliance status",
        description: "An error occurred while updating the compliance status.",
        variant: "destructive",
      });
    }
  };

  //check if there is an attachment not complied

  const {
    isApproving,
    isApprovingError,
    handleApproveLicense,
    handleUpdateInfo,
    DeleteDialog,
  } = UseApplication();

  const handleClick = (action: "approve" | "update") => {
    const applicationId = application?.id ?? "";

    if (action === "approve") {
      handleApproveLicense(applicationId);
    } else if (action === "update") {
      handleUpdateInfo(applicationId);
    }
  };

  const assigneeForm = useForm<AssigneeFormValues>({
    resolver: zodResolver(AssigneeFormSchema),
    defaultValues: {
      assignees: [],
    },
  });

  const {
    data: fetchedUsers,
    isLoading: userLoading,
    isError: ErrorUser,
    refetch: refetchUser,
  } = useQuery({
    queryKey: ["users"],
    queryFn: () => GET("/user/listing", {}, token),
  });

  const {
    mutate: assign,
    isPending,
    error: createError,
    isError: isCreatingError,
  } = useMutation({
    mutationFn: (values: AssigneeFormValues) =>
      POST(`application/assign/${application?.id}`, values, token),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["applications"],
      });
      assigneeForm.reset();
      toast({
        title: "Assignees Added",
        description: "Assignees have been updated successfully.",
      });
    },
  });

  const handleAssigneeChange = (selectedOptions: any) => {
    const newAssignees = selectedOptions.map((option: any) => {
      const role = option.label.split("(")[1]?.replace(")", "") || "";
      const name = option.value.split("(")[0]?.replace(")", "") || "";
      const id = option.value.split("(")[1]?.replace(")", "") || "";
      return {
        name: name,
        role: role,
        id: id,
      };
    });
    setAssigneesValues(newAssignees);
    assigneeForm.setValue("assignees", newAssignees);
  };

  const onSubmitAssignee = (data: AssigneeFormValues) => {
    const newAssignees = data.assignees.map((assignee) => ({
      id: assignee.id,
    }));
    assign(data);
    assigneeForm.reset();
    setAssigneesValues([]);

    router.push("/admin/applications");
  };

  useEffect(() => {
    if (fetchedUsers) {
      let assignableUsers: IUser[] = [];
      switch (user?.role) {
        case Role.CEO:
          assignableUsers = fetchedUsers.filter(
            (u: IUser) =>
              u.role !== Role.ADMIN &&
              u.role !== Role.USER &&
              u.role !== Role.CEO &&
              u.role !== Role.MDD &&
              u.role !== Role.SFA &&
              u.role !== Role.SPO &&
              u.role !== Role.SLO &&
              u.role !== Role.REGISTRY
          );
          break;
        case Role.DRPP:
          assignableUsers = fetchedUsers.filter(
            (u: IUser) =>
              u.role !== Role.ADMIN &&
              u.role !== Role.USER &&
              u.role !== Role.SPO &&
              u.role !== Role.SFA &&
              u.role !== Role.SLO &&
              u.role !== Role.DRPP &&
              u.role !== Role.REGISTRY
          );
          break;
        case Role.MDD:
          assignableUsers = fetchedUsers.filter(
            (u: IUser) =>
              u.role !== Role.ADMIN &&
              u.role !== Role.USER &&
              u.role !== Role.CEO &&
              u.role !== Role.MDD &&
              u.role !== Role.REGISTRY
          );
          break;
        case Role.SPO:
          assignableUsers = fetchedUsers.filter(
            (u: IUser) =>
              u.role !== Role.ADMIN &&
              u.role !== Role.USER &&
              u.role !== Role.CEO &&
              u.role !== Role.SLO &&
              u.role !== Role.DRPP
          );
          break;
        case Role.REGISTRY:
          assignableUsers = fetchedUsers.filter(
            (u: IUser) =>
              u.role !== Role.ADMIN &&
              u.role !== Role.USER &&
              u.role !== Role.SFA &&
              u.role !== Role.DRPP &&
              u.role !== Role.SLO &&
              u.role !== Role.SPO &&
              u.role !== Role.REGISTRY &&
              u.role !== Role.MDD
          );
          break;

        default:
          assignableUsers = [];
      }
      setUsers(assignableUsers);
    }
  }, [fetchedUsers, user?.role]);

  const userOptions = users.map((user) => ({
    value: `${user.name} (${user.id})`,
    label: `${user.name} (${user.role})`,
    id: user.id,
  }));

  const notUser = user?.role !== Role.USER && user?.role !== Role.ADMIN;

  const CompletedStatus = status === ApplicationStatus.COMPLETED;
  const PendingStatus = status === ApplicationStatus.PENDING;
  const isAdditional = status === ApplicationStatus.ADDITIONAL_INFO_REQUIRED;
  const isUpdated = status === ApplicationStatus.UPDATED;
  const isApproved = status === ApplicationStatus.APPROVED_BY_CEO;
  const isApprovedTT = status === ApplicationStatus.APPROVED_BY_RT;
  const isApprovedMLAE = status === ApplicationStatus.APPROVED_BY_MDD;
  const isApprovedDLAE = status === ApplicationStatus.APPROVED_BY_DRPP;
  const isWaitingPayment = application?.control_numbers?.some(
    (control_number) =>
      control_number.payment_status === PaymentStatus.NOTPAID
  );

  const isSPO = user.role === Role.SPO;

  const complied = application?.attachments?.every(
    (attachment) => attachment.compliance === "complied"
  );

  return (
    <div className="my-4">
      {isModalOpen && (
        <AdditionalForm
          id={application?.id!}
          onClose={handleCloseModal}
          isOpen={isModalOpen}
          attachmentId={attachmentId}
        />
      )}
      <Card className="w-full shadow-lg rounded-lg">
        <CardContent className="p-6">
          
            <div className="flex justify-between w-full mb-6">
              <div className="w-1/2 pr-4">
                <table className="w-full border-collapse">
                  <tbody>
                    <tr>
                      <td className="border px-4 py-2 font-bold text-lg">
                        Track Number:
                      </td>
                      <td className="border px-4 py-2">
                        {application?.trackNumber ?? "N/A"}
                      </td>
                    </tr>
                    <tr>
                      <td className="border px-4 py-2 font-bold text-lg">
                        License Type:
                      </td>
                      <td className="border px-4 py-2">
                        {application?.license_types?.name ?? "N/A"}
                      </td>
                    </tr>
                    <tr>
                      <td className="border px-4 py-2 font-bold text-lg">
                        Status:
                      </td>
                      <td className="border px-4 py-2">
                        <span
                          className={`px-2 py-1 rounded ${
                            CompletedStatus
                              ? "bg-blue-100 text-green-800"
                              : PendingStatus
                              ? "bg-yellow-100 text-yellow-800"
                              : isUpdated
                              ? "bg-green-100 text-yellow-800"
                              : isAdditional
                              ? "bg-red-100 text-yellow-800"
                              : isWaitingPayment
                              ? "bg-red-100 text-yellow-800"
                              : isApproved
                              ? "bg-green-100 text-green-800"
                              : isApprovedTT
                              ? "bg-green-100 text-green-800"
                              : isApprovedMLAE
                              ? "bg-green-100 text-green-800"
                              : isApprovedDLAE
                              ? "bg-green-100 text-green-800"
                              : "bg-orange-100 text-yellow-800"
                          }`}
                        >
                          {CompletedStatus
                            ? "Completed"
                            : PendingStatus
                            ? "Pending"
                            : isUpdated
                            ? "Updated"
                            : isAdditional
                            ? "Additional Info Required"
                            : isWaitingPayment
                            ? "Waiting Payment"
                            : isApproved
                            ? "Approved for licensing"
                            : isApprovedTT
                            ? "Technical team approved"
                            : isApprovedMLAE
                            ? "Approved by MLAE"
                            : isApprovedDLAE
                            ? "Approved by DLAE"
                            : "Waiting Approvals"}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="border px-4 py-2 font-bold text-lg">
                        Market value:
                      </td>
                      <td className="border px-4 py-2">
                        {formatCurrency(parseInt(application?.marketValue || "NA"))}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              {notUser && (
                <div className="w-1/2 pl-4">
                  <p>
                    <strong>Assignee:</strong>
                    {application?.assignees
                      .map(
                        (assignee) =>
                          `${assignee?.users?.name} (${assignee?.users?.role})`
                      )
                      .join(", ")}
                  </p>
                  {user?.role !== Role.SFA && user?.role !== Role.SLO && (
                    <Form {...assigneeForm}>
                      <form
                        onSubmit={assigneeForm.handleSubmit(onSubmitAssignee)}
                        className="mb-4"
                      >
                        <h5 className="text-xl font-bold mb-2">Assign</h5>
                        <Select
                          isMulti
                          options={userOptions}
                          {...assigneeForm.register("assignees")}
                          value={userOptions.filter((option) =>
                            assigneesValues.some(
                              (assignee) =>
                                assignee.id ===
                                option.value.split(" (")[1].replace(")", "")
                            )
                          )}
                          onChange={handleAssigneeChange}
                          placeholder="Select assignees"
                          classNamePrefix="react-select"
                        />

                        <Button
                          type="submit"
                          className="mt-2 px-2 py-0"
                          disabled={
                            isPending ||
                            (user?.role === Role.SPO &&
                              status !== ApplicationStatus.APPROVED_BY_RT) ||
                            (user?.role === Role.MDD &&
                              status === ApplicationStatus.APPROVED_BY_RT) ||
                            (user?.role === Role.DRPP &&
                              status === ApplicationStatus.APPROVED_BY_MDD) ||
                            (user?.role === Role.CEO &&
                              status === ApplicationStatus.APPROVED_BY_DRPP) ||
                            CompletedStatus
                          }
                        >
                          {isPending && (
                            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                          )}
                          Save
                        </Button>
                      </form>
                    </Form>
                  )}
                </div>
              )}
            </div>
            <div className="p-3 m-3 flex justify-between">
              <div className="flex ml-auto space-x-2">
                {!complied && isSPO && (
                  <Button
                    onClick={() => handleClick("update")}
                    size="sm"
                    disabled={
                      isApproving ||
                      isAdditional ||
                      application?.attachments?.some(
                        (attachment) => attachment.compliance === null
                      ) ||
                      application?.attachments?.every(
                        (attachment) => attachment.compliance === "complied"
                      )
                    }
                    className="bg-yellow-600 hover:bg-yellow-700 text-white border border-transparent rounded px-2 py-1 flex items-center"
                  >
                    {isApproving && (
                      <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Ask more info
                  </Button>
                )}
              </div>
            </div>
            <div className="w-full flex flex-col items-center">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="border px-3 py-2 font-bold text-lg">
                    Attachments
                  </th>
                  <th className="border px-4 py-2 font-bold text-lg">
                    File Link
                  </th>
                  {user?.role === Role.SPO &&
                    (status === ApplicationStatus.SUBMITTED ||
                      status === ApplicationStatus.UPDATED) && (
                      <th className="border px-4 py-2 font-bold text-lg">
                        Action
                      </th>
                    )}
                </tr>
              </thead>
              <tbody>
                {application?.attachments?.length ? (
                  application.attachments.map((attachment) => (
                    <tr key={attachment.id}>
                      <td className="border px-4 py-2">
                        {attachment.attachment_types.name}
                      </td>
                      <td className="border px-4 py-2">
                        {attachment.file ? (
                          <a
                            href={attachment.file}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-blue-600 hover:bg-blue-700 text-white rounded px-2 py-1 inline-flex items-center justify-center"
                          >
                            View File
                          </a>
                        ) : (
                          <span>No file attached</span>
                        )}
                      </td>
                      {user?.role === Role.SPO &&
                        (status === ApplicationStatus.SUBMITTED ||
                          status === ApplicationStatus.UPDATED) && (
                          <td className="border px-4 py-2">
                            {status === ApplicationStatus.SUBMITTED ? (
                              <>
                                <label>
                                  <input
                                    type="radio"
                                    name={`compliance-${attachment.id}`} // Unique name for each attachment
                                    value="complied"
                                    checked={
                                      attachment.compliance === "complied"
                                    }
                                    onChange={() =>
                                      handleComplianceChange(
                                        attachment.id,
                                        "complied"
                                      )
                                    }
                                  />
                                  Complied
                                </label>
                                <label className="ml-4">
                                  <input
                                    type="radio"
                                    name={`compliance-${attachment.id}`} // Unique name for each attachment
                                    value="not complied"
                                    checked={
                                      attachment.compliance === "not complied"
                                    }
                                    onChange={() =>
                                      handleComplianceChange(
                                        attachment.id,
                                        "not complied"
                                      )
                                    }
                                  />
                                  Not Complied
                                </label>
                              </>
                            ) : (
                              // If the status is UPDATED, show the compliance status or radio buttons
                              <>
                                {attachment.compliance ? (
                                  <span>{attachment.compliance}</span> // Show the compliance value as text
                                ) : (
                                  <>
                                    <label>
                                      <input
                                        type="radio"
                                        name={`compliance-${attachment.id}`} // Unique name for each attachment
                                        value="complied"
                                        checked={
                                          attachment.compliance === "complied"
                                        }
                                        onChange={() =>
                                          handleComplianceChange(
                                            attachment.id,
                                            "complied"
                                          )
                                        }
                                      />
                                      Complied
                                    </label>
                                    <label className="ml-4">
                                      <input
                                        type="radio"
                                        name={`compliance-${attachment.id}`} // Unique name for each attachment
                                        value="not complied"
                                        checked={
                                          attachment.compliance ===
                                          "not complied"
                                        }
                                        onChange={() =>
                                          handleComplianceChange(
                                            attachment.id,
                                            "not complied"
                                          )
                                        }
                                      />
                                      Not Complied
                                    </label>
                                  </>
                                )}
                              </>
                            )}
                          </td>
                        )}

                      {status === ApplicationStatus.APPROVED_BY_RT && (
                        <td className="border px-4 py-2">
                          <span>
                            {attachment.compliance || "No compliance status"}
                          </span>
                        </td>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={2} className="border px-4 py-2 text-center">
                      No attachments available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <br />
          <div className="flex justify-between w-full mb-4">
            <div className="w-1/3 pr-4">
              <div className="p-4 bg-gray-50 border rounded-lg shadow-sm">
                <div className="mb-4">
                  <div className="flex space-x-4 mt-4">
                    {!CompletedStatus && (
                      <CommentForm application={application} />
                    )}
                  </div>
                </div>
                <h2 className="text-2xl font-bold mb-4 text-gray-800">
                  Internal Memo
                </h2>
                {(application?.comments?.length ?? 0) > 0 ? (
                  application?.comments.map((comment, index) => (
                    <div
                      key={index}
                      className="border-b py-4 mb-4 last:border-0"
                    >
                      <div className="flex items-center mb-2">
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-semibold text-lg mr-3">
                          {comment?.users?.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-lg font-semibold text-gray-900">
                            {comment?.users?.name}
                          </p>
                          <p className="text-lg font-italic text-gray-900 text-sm">
                            ({comment?.users?.role})
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center mb-2">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center text-gray-600 font-semibold text-lg mr-3"></div>
                        <div>
                          <p className="text-gray-700 text-center">
                            {comment.comment}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No Comments yet.</p>
                )}
              </div>
            </div>

            <div className="w-1/3 pr-4">
              {notUser && (
                <div className="mb-4 p-4 bg-gray-50 border rounded-lg shadow-sm">
                  {(user?.role === Role.SFA || user?.role === Role.SLO) && (
                    <div className="mb-4">
                      <div className="flex space-x-4 mt-4">
                        <div>
                          <RecommendationForm application={application} />
                        </div>
                      </div>
                    </div>
                  )}
                  <h2 className="text-2xl font-bold mb-4 text-gray-800">
                    Recommendations
                  </h2>
                  {(application?.recommendations?.length ?? 0) > 0 ? (
                    application?.recommendations.map(
                      (recommendation, index) => (
                        <div
                          key={index}
                          className="border-b py-4 mb-4 last:border-0"
                        >
                          <div className="flex items-center mb-2">
                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-semibold text-lg mr-3">
                              {recommendation?.users?.name.charAt(0)}
                            </div>
                            <div>
                              <p className="text-lg font-semibold text-gray-900">
                                {recommendation?.users?.name}
                              </p>
                              <span className="text-gray-600 text-sm ml-2">
                                ({recommendation?.users?.role})
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center mb-2">
                            <div className="w-10 h-10 rounded-full flex items-center justify-center text-gray-600 font-semibold text-lg mr-3"></div>
                            <div>
                              <p className="text-gray-700 text-center">
                                {recommendation.recommendation}
                              </p>
                            </div>
                          </div>
                        </div>
                      )
                    )
                  ) : (
                    <p className="text-gray-500">No Recommendations yet.</p>
                  )}
                </div>
              )}
            </div>

            <div className="w-1/3">
              <div className="p-4 bg-gray-50 border rounded-lg shadow-sm">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">
                  More Information Required
                </h2>
                {(application?.additionals?.length ?? 0) > 0 ? (
                  application?.additionals.map((additional, index) => (
                    <div
                      key={index}
                      className="border-b py-4 mb-4 last:border-0"
                    >
                      <div className="flex items-center mb-2">
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-semibold text-lg mr-3">
                          {additional?.users?.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-lg font-semibold text-gray-900">
                            {additional?.users?.name}
                          </p>
                          <span className="text-gray-600 text-sm ml-2">
                            ({additional?.users?.role})
                          </span>
                        </div>
                      </div>
                      <p className="text-gray-700 leading-relaxed">
                        {additional.info}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">
                    No additional information required.
                  </p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <DeleteDialog />
    </div>
  );
};

export default ResponsesPage;
