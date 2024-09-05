"use client";
import DataTable from "@/components/CustomTable/DataTable";
import { DataTableActions } from "@/components/CustomTable/DataTable/DataTableActions";
import { DataTableHeader } from "@/components/CustomTable/DataTable/DataTableHeader";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import React, { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { TopBarContainer } from "../components/TopBar";
import UserForm from "./components/customer-form/user-form";
import UseUsers from "@/app/(FRONTEND)/hooks/use-customers";
import { IUser, User } from "@/types/user";
import { SearchBar } from "@/components/ui/SearchBar"
import { useUserFormStore } from "./components/customer-form/user-form-store";
import { LoadingSpinner } from "@/lib/Utils/loderSpinner";


const formatDate = (dateString: string | number | Date) => {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0'); 
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); 
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};


const Customers = () => {
  const { edit, view } = useUserFormStore();
  const searchParams = useSearchParams();
  const name = searchParams.get("leaseName");
  const {
    rowSelection,
    userResponse,
    isLoading,
    isError,
    setRowSelection,
    DeleteDialog,
    handleDelete,
    setPagination,
    pagination,
    handleActivate,
    handleDeactivate
  } = UseUsers();

  const [searchTerm, setSearchTerm] = useState<string | undefined>();

  const handleSearch = (value: string | undefined) => {
    setSearchTerm(value);
  };

  // Filtering logic for users based on the search term
  const filteredUsers = useMemo(() => {
    if (!searchTerm) return userResponse?.list || [];
    return (userResponse?.list || []).filter((user: { name: string; }) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, userResponse]);

  const columns: ColumnDef<IUser>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
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
    // Define your columns here
    {
      id: "name",
      accessorKey: "name",
      enableColumnFilter: false,
      size: 200,
      header: ({ column }) => (
        <DataTableHeader column={column} title="Name" />
      ),
      cell: ({ row }) => (
        <div className=" flex flex-row gap-5">
          {/* <div className="w-6 h-6  bg-primary items-center justify-center flex  opacity-40 rounded ">
            <span className=" text-primary-foreground">
              {row.original?.displayName}
            </span>
          </div> */}

          <div className=" flex flex-col ">
            <span>{row.getValue("name")}</span>
          </div>
        </div>
      ),
    },
    {
      id: "email",
      accessorKey: "email",
      header: ({ column }) => <DataTableHeader column={column} title="Email" />,
      cell: ({ row }) => (
        <div>
          <div className=" flex flex-row items-center">
            <span>{row.getValue("email")}</span>
          </div>
        </div>
      ),
    },
    {
      id: "role",
      accessorKey: "role",
      header: ({ column }) => <DataTableHeader column={column} title="Role" />,
      cell: ({ row }) => (
        <div>
          <div className=" flex flex-row items-center">
            <span>{row.getValue("role")}</span>
          </div>
        </div>
      ),
    },
    {
      id: "phone_number",
      accessorKey: "phone_number",
      header: ({ column }) => (
        <DataTableHeader column={column} title="Phone" />
      ),
      cell: ({ row }) => (
        <div>
          <div className=" flex flex-row items-center">
            <span>{row.getValue("phone_number")}</span>
          </div>
        </div>
      ),
    },
    {
      id: "status",
      accessorKey: "status",
      header: ({ column }) => (
        <DataTableHeader column={column} title="Status" />
      ),
      cell: ({ row }) => {
        const status = row.getValue("status");
        const isActive = status === 1;
        return (
          <div>
            <div className="flex flex-row items-center">
              <span
                className={`px-2 py-1 rounded ${
                  isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}
              >
                {isActive ? "Active" : "Inactive"}
              </span>
            </div>
          </div>
        );
      },
    },
    
    
    {
      id: "created_at",
      accessorKey: "created_at",
      header: ({ column }) => (
        <DataTableHeader column={column} title="Created Date" />
      ),
      cell: ({ row }) => (
        <div>
          <div className="flex flex-row items-center">
            <span>{formatDate(row.getValue("created_at"))}</span>
          </div>
        </div>
      ),
    },
    {
      id: "actions",
      enableHiding: true,
      header: ({ column }) => (
        <DataTableHeader column={column} title="Actions" />
      ),
      cell: ({ row }) => {
        const userStatus = row.original.status;
        const isActive = userStatus === 1; // Adjust this based on your status values
    
        return (
          <DataTableActions
            row={row}
            actions={[
              {
                title: "View",
                onPress: () => {
                  view(row.original);
                },
              },
              {
                title: "Edit",
                onPress: () => {
                  edit(row.original);
                },
              },
              {
                title: isActive ? "Deactivate" : "Activate",
                onPress: () => {
                  isActive?
                  handleDeactivate(
                    row.original.id,
                    row.original.name
                  ):
                  handleActivate(
                    row.original.id,
                    row.original.name
                  );
                },
              },
              {
                title: "Delete",
                onPress: () => {
                  handleDelete(row.original.id, row.original.name);
                },
              },
            ]}
          />
        );
      },
    },
    
  ];

  if (isLoading) return <LoadingSpinner />;
  if (isError) return <div>Error loading data</div>;


  return (
    <>
      <TopBarContainer>
        <div className="flex flex-row items-center justify-between ml-4 mr-1">
          <span>Users {name ? `for ${name}` : ""}</span>
          <div className="flex">
            <div className="mr-16">
              <SearchBar onSearch={handleSearch} />
            </div>
            <UserForm/>
          </div>
        </div>
      </TopBarContainer>

      {/* Render the DataTable with filteredUsers */}
      <DataTable
        pageCount={userResponse?.pages}
        data={filteredUsers}
        columns={columns}
        pagination={pagination}
        SetPagination={setPagination}
        paginated
        loading={isLoading}
        onRowClicked={view}
        rowSelection={rowSelection}
        setRowSelection={setRowSelection}
      />
      <DeleteDialog />
    </>
  );
};

export default Customers;
