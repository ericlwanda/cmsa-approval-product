"use client";
import React, { useMemo, useState } from "react";
import DataTable from "@/components/CustomTable/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableHeader } from "@/components/CustomTable/DataTable/DataTableHeader";
import { DataTableActions } from "@/components/CustomTable/DataTable/DataTableActions";
import { TopBarContainer } from "../components/TopBar";
import { useRouter, useSearchParams } from "next/navigation";
import { IControlNumber} from "@/types/user";
import { Icons } from "@/components/Icons";
import UsePayments from "../../hooks/use-payments";
import PaymentForm from "./components/payment-form/payment-form";
import { LoadingSpinner } from "@/lib/Utils/loderSpinner";

const page = () => {
  const router = useRouter();

  const {
    rowSelection,
    isLoading,
    setRowSelection,
    setPagination,
    pagination,
    payments,
    isError,
  } = UsePayments();

  const columns = useMemo<ColumnDef<IControlNumber>[]>(
    () => [
      {
        id: "control_number",
        accessorKey: "control_number",
        header: ({ column }) => (
          <DataTableHeader column={column} title="Control number" />
        ),
        cell: ({ row }) => (
          <div className="w-[100px]">{row.getValue("control_number")}</div>
        ),
        enableSorting: false,
        enableHiding: false,
      },
      {
        id: "description",
        accessorKey: "description",
        header: ({ column }) => (
          <DataTableHeader column={column} title="description" />
        ),
        cell: ({ row }) => (
          <div className="w-[100]">{row.getValue("description")}</div>
        ),
        enableSorting: false,
        enableHiding: false,
      },
      {
        id: "payment_time",
        accessorKey: "payment_time",
        header: ({ column }) => (
          <DataTableHeader column={column} title="Payment time" />
        ),
        cell: ({ row }) => (
          <div className="w-[100px]">{row.getValue("payment_time")}</div>
        ),
        enableSorting: false,
        enableHiding: false,
      },
      {
        id: "payment_status",
        accessorKey: "payment_status",
        header: ({ column }) => (
          <DataTableHeader column={column} title="Payment status" />
        ),
        cell: ({ row }) => (
          <>
            <div className=" w-[100px]">
              <span
                className={`px-2 py-1 rounded items-center ${
                  row.getValue("payment_status") === "PAID"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-yellow-800"
                }`}
              >
                {" "}
                {row.getValue("payment_status")}
              </span>
            </div>
          </>
        ),
        enableSorting: false,
        enableHiding: false,
      },
      {
        id: "Payer",
        accessorKey: "payer",
        header: ({ column }) => (
          <DataTableHeader column={column} title="Payer" />
        ),
        cell: ({ row }) => (
          <div className="w-[100px]">{row.original.users.name}</div>
        ),
        enableSorting: false,
        enableHiding: false,
      },
      {
        id: "actions",
        enableHiding: true,
        header: ({ column }) => (
          <DataTableHeader column={column} title="Actions" />
        ),
        cell: ({ row }) => (
          <DataTableActions
            row={row}
            actions={[
              {
                title: "View",
                onPress: () => {
                  router.push(`/admin/payment-types/${row.original.id}`);
                },
              },
            ]}
          />
        ),
      },
    ],
    []
  );

  if (isLoading) return <LoadingSpinner />;
  if (isError) return <div>Error loading data</div>;
  return (
    <>
      <TopBarContainer>
        <div className="flex flex-row items-center justify-between mx-4">
          <span>Payments</span>
          <div className="flex">
            <PaymentForm />
          </div>
        </div>
      </TopBarContainer>{" "}
      {isLoading ? (
        <div className="w-full flex flex-col items-center">
          <Icons.spinner className="mr-2 h-8 w-8 animate-spin" />
        </div>
      ) : isError ? (
        <p>Error loading payments</p>
      ) : (
        <DataTable
          pageCount={payments?.pages}
          data={payments?.list}
          columns={columns}
          pagination={pagination}
          SetPagination={setPagination}
          paginated
          loading={isLoading}
          // onRowClicked={view}
          rowSelection={rowSelection}
          setRowSelection={setRowSelection}
        />
      )}
    </>
  );
};

export default page;
