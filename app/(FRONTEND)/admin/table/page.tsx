"use client";
import React, { useMemo, useState } from "react";
import { Person, dummyPeople } from "@/lib/data/people";
import DataTable from "@/components/CustomTable/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableHeader } from "@/components/CustomTable/DataTable/DataTableHeader";
import { DataTableActions } from "@/components/CustomTable/DataTable/DataTableActions";
import { TopBarContainer } from "../components/TopBar";
import UsersForm from "./components/Form/users-form";
import { UseUsersFormStore } from "./components/Form/users-form-store";
import { useConfirm } from "@/app/hooks/use-alert-dialog/use-confirm";
import { Checkbox } from "@/components/ui/checkbox";

const page = () => {
  const { edit, view } = UseUsersFormStore();
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
  const columns = useMemo<ColumnDef<Person>[]>(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Select all"
            className="translate-y-[2px]"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
            className="translate-y-[2px]"
          />
        ),
        enableSorting: false,
        enableHiding: true,
      },
      {
        id: "first_name",
        accessorKey: "name.firstName",
        header: ({ column }) => (
          <DataTableHeader column={column} title="First name" />
        ),
        cell: ({ row }) => (
          <div className="w-[80px]">{row.getValue("first_name")}</div>
        ),
        enableSorting: false,
        enableHiding: false,
      },
      {
        id: "last_name",
        accessorKey: "name.lastName",
        header: ({ column }) => (
          <DataTableHeader column={column} title="Last name" />
        ),
        cell: ({ row }) => (
          <div className="w-[80px]">{row.getValue("last_name")}</div>
        ),
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: "address",
        header: ({ column }) => (
          <DataTableHeader column={column} title="Address" />
        ),
        cell: ({ row }) => (
          <div className="w-[80px]">{row.getValue("address")}</div>
        ),
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: "city",
        header: ({ column }) => (
          <DataTableHeader column={column} title="City" />
        ),
        cell: ({ row }) => (
          <div className="w-[80px]">{row.getValue("city")}</div>
        ),
        enableSorting: false,
      },
      {
        accessorKey: "state",
        header: ({ column }) => (
          <DataTableHeader column={column} title="State" />
        ),
        cell: ({ row }) => (
          <div className="w-[80px]">{row.getValue("state")}</div>
        ),
        enableSorting: false,
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
                title: "Edit",
                onPress: () => edit(row.original),
              },
              {
                title: "Delete",
                onPress: () => {
                  handleDelete(row.original.id, row.original.name.firstName);
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
          <span>Users</span>
          <UsersForm />
        </div>
      </TopBarContainer>
      <DataTable
        title="USERS"
        description="This is a list of users in the system"
        data={dummyPeople}
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
