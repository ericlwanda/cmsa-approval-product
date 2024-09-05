"use client";
import React, { useMemo, useState } from "react";
import { Person, dummyPeople,Forms,Form } from "@/lib/data/people";
import DataTable from "@/components/CustomTable/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableHeader } from "@/components/CustomTable/DataTable/DataTableHeader";
import { DataTableActions } from "@/components/CustomTable/DataTable/DataTableActions";
import { TopBarContainer } from "../components/TopBar";
import { useConfirm } from "@/app/(FRONTEND)/hooks/use-alert-dialog/use-confirm";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";


const page = () => {

  const [DeleteDialog, confirmDelete] = useConfirm();
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [rowSelection, setRowSelection] = useState({});

  const handleDelete = async (id?: number, label?: string) => {
    const confirm = await confirmDelete({
      title: "Confirm Delete",
      //   message: `Are you sure you want to delete ${label} property?`,
      message: "Are you sure you want to delete User",
    });
    if (confirm) {
      console.log("deleted");
    }
  };
  const columns = useMemo<ColumnDef<Form>[]>(
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
        id: "link",
        accessorKey: "link",
        header: ({ column }) => (
          <DataTableHeader column={column} title="Download Link" />
        ),
        cell: ({ row }) => (
          <Link
            href={`${row.getValue('link')}`}
           
          >
            Download
          </Link>
        ),
        enableSorting: false,
        enableHiding: false,
      }
      

    

    ],
    []
  );
  return (
    <>
      <TopBarContainer>
        <div className="flex flex-row items-center justify-between mx-4">
          <span>FORMS</span>

        </div>
      </TopBarContainer>
      <DataTable
        title="FORMS"
        description="List of forms"
        data={Forms}
        columns={columns}
        rowSelection={rowSelection}
        setRowSelection={(value) => setRowSelection(value)}
        pagination={pagination}
        SetPagination={(payload) => setPagination(payload)}
        paginated
      />
      <DeleteDialog />
    </>
  );
};

export default page;
