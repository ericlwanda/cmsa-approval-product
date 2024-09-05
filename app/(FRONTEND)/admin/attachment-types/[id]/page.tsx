"use client";
import React, { useMemo, useState } from "react";
import DataTable from "@/components/CustomTable/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableHeader } from "@/components/CustomTable/DataTable/DataTableHeader";
import { DataTableActions } from "@/components/CustomTable/DataTable/DataTableActions";
import { TopBarContainer } from "../../components/TopBar";
import { useRouter, useSearchParams } from "next/navigation";
import UseLicenseTypes from "@/app/(FRONTEND)/hooks/use-license-type";
import LicenseTypeForm from "../components/attachment-type-form/attachement-type-form";
import { IAttachmentType, ILicenseType, IPaymentType } from "@/types/user";



import { Icons } from "@/components/Icons";
import UseAttachmentTypes from "../../../hooks/use-attachment_types";
import AttachmentTypeForm from "../components/attachment-type-form/attachement-type-form";
import { useAttachmentTypeFormStore } from "../components/attachment-type-form/attachment-type-form-store";
import { useQuery } from "@tanstack/react-query";
import { GET } from "@/lib/client/client";
import { tokenFromSession } from "@/lib/tokenFromSession";
import { LoadingSpinner } from "@/lib/Utils/loderSpinner";

const page = ({ params }: { params: { id: string } }) => {
  const token = tokenFromSession();
const router = useRouter();
const { edit, view } = useAttachmentTypeFormStore();

const license_type_id = params.id;

const [pagination, setPagination] = useState({
  pageIndex: 0,
  pageSize: 10,
});
const [rowSelection, setRowSelection] = useState({});
const {
  data: attachmentTypes,
  isPending: isLoading,
  isError,
  refetch,
} = useQuery({
  queryKey: ["attachmentTypes", pagination.pageIndex, pagination.pageSize],
  queryFn: () =>
    GET(`/attachment-type/page/${license_type_id}`, { page: pagination.pageIndex, limit: pagination.pageSize },token),
});
  
  const {
    DeleteDialog,
    handleDelete,
  } = UseAttachmentTypes();


  const columns = useMemo<ColumnDef<IAttachmentType>[]>(
    () => [
    
      {
        id: "name",
        accessorKey: "name",
        header: ({ column }) => (
          <DataTableHeader column={column} title="Name" />
        ),
        cell: ({ row }) => (
          <div className="w-[500px]">{row.getValue("name")}</div>
        ),
        enableSorting: false,
        enableHiding: false,
      },
      {
        id: "LicenseType",
        accessorKey: "LicenseType",
        header: ({ column }) => (
          <DataTableHeader column={column} title="license type" />
        ),
        cell: ({ row }) => (
          <div className="w-[100px]">{row.original.license_types.name}</div>
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
                  view(row.original);
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
          <span>Attachment Types</span>
          <div className="flex">
            <AttachmentTypeForm licenseTypeId ={license_type_id}/>
          </div>
        </div>
      </TopBarContainer>
      {isLoading ? (
        <div className="w-full flex flex-col items-center">
          <Icons.spinner className="mr-2 h-8 w-8 animate-spin" />
        </div>
      ) : isError ? (
        <p>Error loading application</p>
      ) : (
      <DataTable
      pageCount={attachmentTypes?.pages}
      data={attachmentTypes?.list}
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
      <DeleteDialog />
    </>
  );
};

export default page;
