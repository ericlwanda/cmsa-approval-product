"use client";
import React, { useMemo, useState } from "react";
import { Application, ILicense, ILicenseType } from "@/types/user";
import DataTable from "@/components/CustomTable/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableHeader } from "@/components/CustomTable/DataTable/DataTableHeader";
import { DataTableActions } from "@/components/CustomTable/DataTable/DataTableActions";
import { TopBarContainer } from "../components/TopBar";
import { useConfirm } from "@/app/(FRONTEND)/hooks/use-alert-dialog/use-confirm";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter, useSearchParams } from "next/navigation";
import UseApplication from "../../hooks/use-application";
import { license } from "@prisma/client";
import UseLicense from "../../hooks/use-license";
import { LoadingSpinner } from "@/lib/Utils/loderSpinner";

const page = () => {
const router = useRouter();
const {
  rowSelection,
  isLoading,
  setRowSelection,
  DeleteDialog,
  setPagination,
  isError,
  pagination,
  licenses
} = UseLicense();

  const columns = useMemo<ColumnDef<ILicenseType>[]>(
    () => [
    

      {
        id: "name",
        accessorKey: "name",
        header: ({ column }) => (
          <DataTableHeader column={column} title="Licenses" />
        ),
        cell: ({ row }) => (
          <div className="w-[80px]">{row.getValue("name")}</div>
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
                title: "view",
                onPress: () => {
                  const finalElement = row.original.applications.length-1;
                    router.push(
                        `/admin/license/view/${row.original.applications[finalElement].id}`
                      );
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
          <span>Approval letters</span>
        </div>
      </TopBarContainer>
      <DataTable
      pageCount={licenses?.pages}
      data={licenses?.list}
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
