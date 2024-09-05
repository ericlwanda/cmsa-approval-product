"use client";
import React, { useMemo, useState } from "react";
import DataTable from "@/components/CustomTable/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableHeader } from "@/components/CustomTable/DataTable/DataTableHeader";
import { DataTableActions } from "@/components/CustomTable/DataTable/DataTableActions";
import { TopBarContainer } from "../components/TopBar";
import UseApplication from "@/app/(FRONTEND)/hooks/use-application";
import { Application } from "@/types/user";
import { useRouter } from "next/navigation";
import { Icons } from "@/components/Icons";
import userFromSession from "@/lib/userFromSession";
import ApplicationForm from "./components/Form/application/application-form";
import { UseApplicationsFormStore } from "./components/Form/application/application-form-store";
import { ApplicationStatus, PaymentStatus, Role } from "@/lib/enums/enums";
import { LoadingSpinner } from "@/lib/Utils/loderSpinner";
import { formatCurrency } from "@/lib/utils";

const page = () => {
  const router = useRouter();
  const { edit } = UseApplicationsFormStore();
  const user = userFromSession();

  const {
    rowSelection,
    isLoading,
    setRowSelection,
    DeleteDialog,
    handleDelete,
    setPagination,
    pagination,
    Applications,
    isError,
  } = UseApplication();

  const canApply = user?.role === "USER";

  const columns = useMemo<ColumnDef<Application>[]>(
    () => [
      {
        id: "trackNumber",
        accessorKey: "trackNumber",
        header: ({ column }) => (
          <DataTableHeader column={column} title="Track Number" />
        ),
        cell: ({ row }) => (
          <div className="w-[80px]">{row.getValue("trackNumber")}</div>
        ),
        enableSorting: false,
        enableHiding: false,
      },
      {
        id: "licenseType",
        accessorKey: "licenseType",
        header: ({ column }) => (
          <DataTableHeader column={column} title="License Type" />
        ),
        cell: ({ row }) => (
          <div className="w-[80px]">{row.original.license_types.name}</div>
        ),
        enableSorting: false,
        enableHiding: false,
      },
      {
        id: "marketValue",
        accessorKey: "marketValue",
        header: ({ column }) => (
          <DataTableHeader column={column} title="Market value" />
        ),
        cell: ({ row }) => (
          <div className="w-[80px]">{formatCurrency(parseInt(row.original.marketValue))}</div>
        ),
        enableSorting: false,
        enableHiding: false,
      },

      {
        id: "status",
        accessorKey: "status",
        header: ({ column }) => (
          <DataTableHeader column={column} title="Status" />
        ),
        cell: ({ row }) => {
          const status = row.getValue("status");
          const isComplete = status === ApplicationStatus.COMPLETED;
          const isPending = status === ApplicationStatus.PENDING;
          const isUpdated = status === ApplicationStatus.UPDATED;
          const isAdditional =
            status === ApplicationStatus.ADDITIONAL_INFO_REQUIRED;
          const isApproved = status === ApplicationStatus.APPROVED_BY_CEO;
          const isApprovedRT = status === ApplicationStatus.APPROVED_BY_RT;
          const isApprovedMDD = status === ApplicationStatus.APPROVED_BY_MDD;
          const isApprovedDRPP = status === ApplicationStatus.APPROVED_BY_DRPP;

          const isWaitingPayment = row.original?.control_numbers?.some(
            (control_number) =>
              control_number.payment_status === PaymentStatus.NOTPAID
          );

          return (
            <div>
              <div className="flex flex-row items-center">
                <span
                  className={`px-2 py-1 rounded ${
                    isComplete
                      ? "bg-green-100 text-green-800"
                      : isPending
                      ? "bg-yellow-100 text-yellow-800"
                      : isUpdated
                      ? "bg-green-100 text-yellow-800"
                      : isAdditional
                      ? "bg-red-100 text-yellow-800"
                      : isWaitingPayment
                      ? "bg-red-100 text-yellow-800"
                      : isApproved
                      ? "bg-green-100 text-green-800"
                      : isApprovedRT
                      ? "bg-green-100 text-green-800"
                      : isApprovedMDD
                      ? "bg-green-100 text-green-800"
                      : isApprovedDRPP
                      ? "bg-green-100 text-green-800"
                      : "bg-orange-100 text-yellow-800"
                  }`}
                >
                  {user.role === Role.USER
                    ? isComplete
                      ? "CERTIFIED"
                      : isPending
                      ? "Pending"
                      : isUpdated
                      ? "Updated"
                      : isAdditional
                      ? "Additional Info Required"
                      : isWaitingPayment
                      ? "Waiting Payment"
                      : isApproved
                      ? "Waiting final payments"
                      : isApprovedRT
                      ? "Finalising approvals"
                      : isApprovedMDD
                      ? "Finalising approvals"
                      : isApprovedDRPP
                      ? "Finalising approvals"
                      : "Waiting Approvals"
                    : isComplete
                    ? "CERTIFIED"
                    : isPending
                    ? "Under Review"
                    : isUpdated
                    ? "Modified"
                    : isAdditional
                    ? "Additional Details Needed"
                    : isWaitingPayment
                    ? "Awaiting Payment"
                    : isApproved
                    ? "Approved for Licensing"
                    : isApprovedRT
                    ? "Review team approved"
                    : isApprovedMDD
                    ? "Approved by MDD"
                    : isApprovedDRPP
                    ? "Approved by DRPP"
                    : "Pending Approval"}
                </span>
              </div>
            </div>
          );
        },
      },
      {
        id: "actions",
        enableHiding: true,
        header: ({ column }) => (
          <DataTableHeader column={column} title="Actions" />
        ),
        cell: ({ row }) => {
          const actions = [];
          if (user?.role === "USER") {
            // Check if status is not "pending" to include "Edit" and "Delete" actions
            if (row.original.status === "PENDING") {
              actions.push({
                title: "View",
                onPress: () => {
                  router.push(
                    `/admin/applications/confirmation/${row.original.id}`
                  );
                },
              });

              actions.push({
                title: "Delete",
                onPress: () => {
                  handleDelete(row.original.id, row.original.trackNumber);
                },
              });
            } else if (row.original.status === "COMPLETED") {
              // actions.push({
              //   title: "View",
              //   onPress: () => {
              //     router.push(`/admin/license/view/${row.original?.id}`);
              //   },
              // });
            } else {
              actions.push({
                title: "View",
                onPress: () => {
                  router.push(
                    `/admin/applications/confirmation/${row.original.id}`
                  );
                },
              });
            }
          } else {
            actions.push({
              title: "view",
              onPress: () => {
                router.push(`/admin/applications/view/${row.original.id}`);
              },
            });
          }

          return <DataTableActions row={row} actions={actions} />;
        },
      },
    ],
    []
  );

  
  return (
    <>
      <TopBarContainer>
        <div className="flex flex-row items-center justify-between mx-4">
          <span>Application</span>
          {/* <UsersForm /> */}

          <div>{canApply && <ApplicationForm />}</div>
        </div>
      </TopBarContainer>
        <DataTable
          pageCount={Applications?.pages}
          data={Applications?.list}
          columns={columns}
          pagination={pagination}
          SetPagination={setPagination}
          paginated
          loading={isLoading}
          // onRowClicked={view}
          rowSelection={rowSelection}
          setRowSelection={setRowSelection}
        />


      <DeleteDialog />
    </>
  );
};

export default page;
