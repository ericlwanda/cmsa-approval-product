import React, { useState } from "react";
import { useConfirm } from "./use-alert-dialog/use-confirm";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { DELETE, GET, POST } from "@/lib/client/client";
import { toast } from "@/components/ui/use-toast";
import { tokenFromSession } from "@/lib/tokenFromSession";

const UseLicenseTypes = () => {
  const token = tokenFromSession();
  const [DeleteDialog, confirmDelete] = useConfirm();
  const queryClient = useQueryClient();
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [rowSelection, setRowSelection] = useState({});
  const {
    data: licenseTypes,
    isPending: isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["licenseTypes", pagination.pageIndex, pagination.pageSize],
    queryFn: () =>
      GET("/license-type/page", { page: pagination.pageIndex, limit: pagination.pageSize },token),
  });


  const { mutate: Delete, isPending: isDeleting } = useMutation({
    mutationFn: (id: string) => DELETE(`/license-type/delete/${id}`,token),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({
        queryKey: ["licenseTypes"],
      });
      toast({
        title: "Success!",
        description: `License type deleted successfully`,
      });
    },
    onError: (e: Error) => {
      toast({
        title: "Error Occurred!",
        description: e?.message ?? `An error occured`,
      });
      setRowSelection({});
    },
  });

  const handleDelete = async (id: string, label?: string) => {
    const confirm = await confirmDelete({
      title: "Confirm Delete",
      //   message: `Are you sure you want to delete ${label} property?`,
      message: `Are you sure you want to delete ${label} ?`,
    });
    if (confirm) {
      Delete(id);
    }
  };

  return {
    DeleteDialog,
    confirmDelete,
    handleDelete,
    pagination,
    setPagination,
    rowSelection,
    setRowSelection,
    licenseTypes,
    isLoading,
    isError
  };
};

export default UseLicenseTypes;
