import UseApplication from "@/app/(FRONTEND)/hooks/use-application";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import userFromSession from "@/lib/userFromSession";
import { Application } from "@/types/user";
import { useForm } from "react-hook-form";
import { useState, useEffect, Key } from "react";
import { toast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { GET, POST } from "@/lib/client/client";
import AttachmentForm from "./Form/attachement/attachment-form";
import Modal from "@/lib/services/Modal";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { DialogFooter } from "@/components/ui/dialog";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { tokenFromSession } from "@/lib/tokenFromSession";
import { Icons } from "@/components/Icons";
import ReportForm from "./Form/report/report-form";
import ApproveForm from "./Form/approve/approve-form";
import { ApplicationStatus, Role } from "@/lib/enums/enums";

interface Props {
  application?: Application;
}

const ApproveFormSchema = z.object({
  file: z.string(),
});

type ApproveFormValues = z.infer<typeof ApproveFormSchema>;

const ReportsPage = (props: Props) => {
  const { application } = props;
  const user = userFromSession();
  // State for modal visibility
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reportId, setReportId] = useState<string | null>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false); // State to manage modal visibility

  // Function to handle modal open
  const openModal = () => {
    setIsModalOpen(true);
  };

  // Function to handle modal close
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Sample report links

  const handleAttach = (id: string) => {
    setReportId(id);
    setIsReportModalOpen(true); // Open the modal when "Attach File" is clicked
  };

  const handleCloseReportModal = () => {
    setIsReportModalOpen(false);
    setReportId(null); // Reset the attachment ID when closing the modal
  };

  return (
    <div className="my-4">
      <Card className="w-full shadow-lg rounded-lg">
        <CardContent className="p-6">
          {/* Buttons Above the Table */}
          <div className="flex justify-between mb-4">
            {application?.report === null && (
              <Button
                onClick={() => handleAttach(application?.id || "")}
                size="sm"
                disabled={
                  !application?.attachments?.every(
                    (attachment) => attachment.compliance === "complied"
                  )
                }
                className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1"
              >
                Upload Report
              </Button>
            )}
            {application?.report !== null &&
              ((user?.role === Role.SPO &&
                (application?.status === ApplicationStatus.SUBMITTED ||
                  application?.status === ApplicationStatus.UPDATED)) ||
                (user?.role === Role.MDD &&
                  application?.status === ApplicationStatus.APPROVED_BY_RT) ||
                (user?.role === Role.DRPP &&
                  application?.status === ApplicationStatus.APPROVED_BY_MDD) ||
                (user?.role === Role.CEO &&
                  application?.status ===
                    ApplicationStatus.APPROVED_BY_DRPP)) && (
                <Button
                  onClick={openModal}
                  className="bg-green-600 hover:bg-green-700 text-white px-2 py-0"
                >
                  Approve
                </Button>
              )}
          </div>

          {/* Reports Table */}
          <h2 className="text-lg font-semibold mb-4">Reports</h2>
          <table className="min-w-full border-collapse border border-gray-300">
            <thead>
              <tr>
                <th className="border px-4 py-2 text-left">Report Name</th>
                <th className="border px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {application?.report !== null && (
                <tr key={application?.report?.id}>
                  <td className="border px-4 py-2">
                    <a
                      href={application?.report?.file}
                      className="text-blue-600 hover:underline"
                    >
                      {application?.report?.name}
                    </a>
                  </td>
                  <td className="border px-4 py-2">
                    <a
                      className="bg-blue-600 hover:bg-blue-700 text-white rounded px-2 py-2 inline-flex items-center justify-center"
                      href={application?.report?.file}
                      target="_blank"
                      rel="noopener noreferrer"
                      // className="text-blue-600 underline"
                    >
                      View
                    </a>
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {isReportModalOpen && (
            <ReportForm
              id={reportId!}
              onClose={handleCloseReportModal}
              isOpen={isReportModalOpen}
            />
          )}

          {isModalOpen && (
            <ApproveForm
              id={application?.id!}
              onClose={closeModal}
              isOpen={isModalOpen}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportsPage;
