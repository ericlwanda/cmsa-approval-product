"use client";
import React, { useMemo, useState } from "react";
import DataTable from "@/components/CustomTable/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableHeader } from "@/components/CustomTable/DataTable/DataTableHeader";
import { DataTableActions } from "@/components/CustomTable/DataTable/DataTableActions";
import { TopBarContainer } from "../../components/TopBar";
import { useRouter, useSearchParams } from "next/navigation";
import UseLicenseTypes from "@/app/(FRONTEND)/hooks/use-license-type";
import { usePaymentTypeFormStore } from "../components/payment-type-form/payment-type-form-store";
import LicenseTypeForm from "../components/payment-type-form/payment-type-form";
import { ILicenseType, IPaymentType } from "@/types/user";
import PaymentTypeForm from "../components/payment-type-form/payment-type-form";
import UsePaymentTypes from "../../../hooks/use-payment-types";
import { Icons } from "@/components/Icons";
import { formatCurrency } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { GET } from "@/lib/client/client";
import { tokenFromSession } from "@/lib/tokenFromSession";

const page = ({ params }: { params: { id: string } }) => {
  const token = tokenFromSession();
const router = useRouter();
const { edit, view } = usePaymentTypeFormStore();

const license_type_id = params.id;

const [pagination, setPagination] = useState({
  pageIndex: 0,
  pageSize: 10,
});
const [rowSelection, setRowSelection] = useState({});
const {
  data: paymentTypes,
  isPending: isLoading,
  isError,
  refetch,
} = useQuery({
  queryKey: [`paymentTypes/${license_type_id}`, pagination.pageIndex, pagination.pageSize],
  queryFn: () =>
    GET(`/payment-type/page/${license_type_id}`, { page: pagination.pageIndex, limit: pagination.pageSize },token),
});
  const {
    DeleteDialog,
    handleDelete,
  } = UsePaymentTypes();


  const columns = useMemo<ColumnDef<IPaymentType>[]>(
    () => [
    
      {
        id: "name",
        accessorKey: "name",
        header: ({ column }) => (
          <DataTableHeader column={column} title="Name" />
        ),
        cell: ({ row }) => (
          <div className="w-[100px]">{row.getValue("name")}</div>
        ),
        enableSorting: false,
        enableHiding: false,
      },
      {
        id: "LicenseType",
        accessorKey: "LicenseType",
        header: ({ column }) => (
          <DataTableHeader column={column} title="License type" />
        ),
        cell: ({ row }) => (
          <div className="w-[100px]">{row.original.license_types.name}</div>
        ),
        enableSorting: false,
        enableHiding: false,
      },  {
        id: "amount",
        accessorKey: "amount",
        header: ({ column }) => (
          <DataTableHeader column={column} title="Amount" />
        ),
        cell: ({ row }) => (
          <div className="w-[100px]">{formatCurrency(row.original.amount)}</div>
        ),
        enableSorting: false,
        enableHiding: false,
      },
      {
        id: "for_company",
        accessorKey: "for_company",
        header: ({ column }) => (
          <DataTableHeader column={column} title="For" />
        ),
        cell: ({ row }) => (
          <div className="w-[100px]">
            {(row.original.for_company === 1) ? "Company" : "Representative"}
          </div>
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
  return (
    <>
      <TopBarContainer>
        <div className="flex flex-row items-center justify-between mx-4">
          <span>Payment Types</span>
          <div className="flex">
            <PaymentTypeForm licenseTypeId ={license_type_id}/>
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
      pageCount={paymentTypes?.pages}
      data={paymentTypes?.list}
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
