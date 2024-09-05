import UseApplication from "@/app/(FRONTEND)/hooks/use-application";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { GET, POST } from "@/lib/client/client";
import userFromSession from "@/lib/userFromSession";
import { Application, User } from "@/types/user";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import Select from "react-select";
import z from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
// import { Form, FormControl, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Icons } from "@/components/Icons";
import ApplicationForm from "./Form/application/application-form";
import { Console } from "console";
import AttachmentForm from "./Form/attachement/attachment-form";
import { ApplicationStatus, PaymentStatus, Role } from "@/lib/enums/enums";
import { formatCurrency } from "@/lib/utils";

interface Props {
  application?: Application;
}

const ConfirmationPage = (props: Props) => {
  const [attachmentId, setAttachmentId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // State to manage modal visibility

  const handleAttach = (id: string) => {
    setAttachmentId(id);
    setIsModalOpen(true); // Open the modal when "Attach File" is clicked
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setAttachmentId(null); // Reset the attachment ID when closing the modal
  };

  const { application } = props;

  const {
    isApproving,
    isUpdatingInfo,
    isRemoving,
    handleApprove,
    DeleteDialog,
    handleRemove,
    handleUpdate,
  } = UseApplication();

  const handleClick = (action: "approve" | "update") => {
    const applicationId = application?.id ?? "";

    if (action === "approve") {
      handleApprove(applicationId);
    } else if (action === "update") {
      handleUpdate(applicationId);
    }
  };

  const user = userFromSession();

  const [status, setStatus] = useState<string>(application?.status ?? "");

  const CompletedStatus = status === ApplicationStatus.COMPLETED;
  const PendingStatus = status === ApplicationStatus.PENDING;
  const isUpdated = status === ApplicationStatus.UPDATED;
  const isAdditional = status === ApplicationStatus.ADDITIONAL_INFO_REQUIRED;
  const isApproved = status === ApplicationStatus.APPROVED_BY_CEO;
  const isApprovedTT = status === ApplicationStatus.APPROVED_BY_RT;
  const isApprovedMLAE = status === ApplicationStatus.APPROVED_BY_MDD;
  const isApprovedDLAE = status === ApplicationStatus.APPROVED_BY_DRPP;

  // Check if there are any payments of type one that have NOTPAID status
  const isWaitingPayment = application?.control_numbers?.every(
    (control_number) =>
      control_number.payment_status == PaymentStatus.NOTPAID
  );

  const allAttachmentsHaveFiles = application?.attachments?.every(
    (attachment) => attachment.file && attachment.file.trim() !== ""
  );

  return (
    <div className="my-4">
      <Card className="w-full shadow-lg rounded-lg">
        <CardContent className="p-6">
          <div className="w-full flex flex-col items-center">
            <div className="flex flex-col w-full mb-6">
              <div className="flex w-full mb-6">
                <div className="w-1/2 pr-2">
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
                        Market value:
                      </td>
                      <td className="border px-4 py-2">
                        {formatCurrency(parseInt(application?.marketValue || "NA"))}
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
                              ?  "Waiting final Payment"
                              : isApprovedTT
                              ? "Finalising approvals"
                              : isApprovedMLAE
                              ? "Finalising approvals"
                              : isApprovedDLAE
                              ? "Finalising approvals"
                              : "Waiting Approvals"}
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {isAdditional && (
                  <div className="w-1/2 pl-4">
                    <div className="mb-4 p-4 bg-gray-50 border rounded-lg shadow-sm">
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
                          No additional information available.
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="border px-4 py-2 font-bold text-lg">
                    Required Attachments
                  </th>
                  <th className="border px-4 py-2 font-bold text-lg">File</th>
                  {(PendingStatus || isAdditional) && !isWaitingPayment ? (
                    <th className="border px-4 py-2 font-bold text-lg">
                      Action
                    </th>
                  ) : null}
                </tr>
              </thead>
              <tbody>
                {application?.attachments?.length ? (
                  application.attachments.map((attachment) => (
                    <tr key={attachment.file}>
                      <td className="border px-4 py-2">
                        {attachment.attachment_types.name}
                      </td>
                      <td className="border px-4 py-2">
                        {attachment.file ? (
                          <a
                            href={attachment.file}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline"
                          >
                            View File
                          </a>
                        ) : (
                          <span>No file attached</span>
                        )}
                      </td>
                      {(PendingStatus || isAdditional) && !isWaitingPayment && (
                        <td className="border px-4 py-2 flex space-x-2">
                          {isAdditional ? (
                            // If status is ADDITIONAL
                            attachment.compliance === "complied" ? (
                              // If compliance is complied, show message
                              <span>No action required</span>
                            ) : attachment.file === "" ? (
                              // If compliance is not complied and no file attached, show the attach file button
                              <Button
                                className="bg-blue-600 text-white hover:bg-blue-700 border border-transparent rounded px-4 py-2 flex items-center"
                                onClick={() => handleAttach(attachment?.id)} // Open modal here
                              >
                                <Icons.fileplus className="mr-4 h-6 w-6" />
                                Attach File
                              </Button>
                            ) : attachment.file ? (
                              <Button
                                className="bg-red-600 text-white hover:bg-red-700 border border-transparent rounded px-4 py-2 flex items-center"
                                onClick={() => handleRemove(attachment?.id)}
                              >
                                <Icons.close className="mr-4 h-3 w-3" />
                                Remove
                              </Button>
                            ) : (
                              <Button
                                className="bg-blue-600 text-white hover:bg-blue-700 border border-transparent rounded px-4 py-2 flex items-center"
                                onClick={() => handleAttach(attachment?.id)} // Open modal here
                              >
                                <Icons.fileplus className="mr-4 h-6 w-6" />
                                Attach File
                              </Button>
                            ) // No action required if compliance is not complied but file exists
                          ) : PendingStatus && !isWaitingPayment ? (
                            // Default behavior for PendingStatus
                            <>
                              {attachment.file ? (
                                <Button
                                  className="bg-red-600 text-white hover:bg-red-700 border border-transparent rounded px-4 py-2 flex items-center"
                                  onClick={() => handleRemove(attachment?.id)}
                                >
                                  <Icons.close className="mr-4 h-3 w-3" />
                                  Remove
                                </Button>
                              ) : (
                                <Button
                                  className="bg-blue-600 text-white hover:bg-blue-700 border border-transparent rounded px-4 py-2 flex items-center"
                                  onClick={() => handleAttach(attachment?.id)} // Open modal here
                                >
                                  <Icons.fileplus className="mr-4 h-6 w-6" />
                                  Attach File
                                </Button>
                              )}
                            </>
                          ) : (
                            <span>
                              Please pay the control number to continue
                              uploading the attachments
                            </span>
                          )}
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

            {isModalOpen && (
              <AttachmentForm
                id={attachmentId!}
                onClose={handleCloseModal}
                isOpen={isModalOpen}
              />
            )}
          </div>

          <br></br>
          <div>
            {user?.role === Role.USER && (
              <>
                {PendingStatus && !isWaitingPayment && (
                  <Button
                    onClick={() => handleClick("approve")}
                    size="sm"
                    disabled={isApproving || !allAttachmentsHaveFiles}
                    className={`${
                      allAttachmentsHaveFiles
                        ? "bg-green-600 hover:bg-green-700"
                        : "bg-gray-400 cursor-not-allowed"
                    } text-white border border-transparent rounded px-4 py-2 flex items-center`}
                  >
                    {isApproving && (
                      <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Submit
                  </Button>
                )}

                {isAdditional && (
                  <Button
                    onClick={() => handleClick("update")}
                    size="sm"
                    disabled={isUpdatingInfo || !allAttachmentsHaveFiles}
                    className="bg-green-600 p-4 text-white hover:bg-green-700 hover:text-white border border-transparent rounded px-4 py-2 flex items-center"
                  >
                    {isUpdatingInfo && (
                      <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Update
                  </Button>
                )}
              </>
            )}
          </div>
        </CardContent>
      </Card>
      <DeleteDialog />
    </div>
  );
};

export default ConfirmationPage;
