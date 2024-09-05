"use client";
import React, { useMemo, useState } from "react";
import DataTable from "@/components/CustomTable/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableHeader } from "@/components/CustomTable/DataTable/DataTableHeader";
import { DataTableActions } from "@/components/CustomTable/DataTable/DataTableActions";
import { TopBarContainer } from "../components/TopBar";
import { useRouter, useSearchParams } from "next/navigation";
import UseLicenseTypes from "@/app/(FRONTEND)/hooks/use-license-type";
import { useLicenseTypeFormStore } from "./components/license-type-form/license-type-form-store";
import LicenseTypeForm from "./components/license-type-form/license-type-form";
import { ILicenseType } from "@/types/user";
import { Icons } from "@/components/Icons";
import { LoadingSpinner } from "@/lib/Utils/loderSpinner";

const page = () => {
const router = useRouter();
const { edit, view } = useLicenseTypeFormStore();
  
  const {
    rowSelection,
    isLoading,
    setRowSelection,
    DeleteDialog,
    handleDelete,
    setPagination,
    pagination,
    licenseTypes,
    isError,
  } = UseLicenseTypes();


  const columns = useMemo<ColumnDef<ILicenseType>[]>(
    () => [
    
      {
        id: "name",
        accessorKey: "name",
        header: ({ column }) => (
          <DataTableHeader column={column} title="Name" />
        ),
        cell: ({ row }) => (
          <div className="w-[800px]">{row.getValue("name")}</div>
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
              // {
              //   title: "Payment Types",
              //   onPress: () => {
              //     router.push(`/admin/payment-types/${row.original.id}`);
              //   },
              // },
              {
                title: "Attachment Types",
                onPress: () => {
                  router.push(`/admin/attachment-types/${row.original.id}`);
                },
              },
              {
                title: "edit",
                onPress: () => {
                  edit(row.original)
                },
              },
              {
                title: "delete",
                onPress: () => {
                  handleDelete(row.original.id, row.original.name)
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
          <span>Product Types</span>
          <div className="flex">
            <LicenseTypeForm/>
          </div>
        </div>
      </TopBarContainer>
      <DataTable
      pageCount={licenseTypes?.pages}
      data={licenseTypes?.list}
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
