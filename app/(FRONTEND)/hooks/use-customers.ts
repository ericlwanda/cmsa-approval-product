import React, { useState } from "react";
import { useConfirm } from "./use-alert-dialog/use-confirm";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { DELETE, GET, POST, PUT } from "@/lib/client/client";
import { toast } from "@/components/ui/use-toast";
import { useSession } from "next-auth/react";
import { tokenFromSession } from "@/lib/tokenFromSession";

const UseUsers = () => {

  const token = tokenFromSession();

  const [DeleteDialog, confirmDelete] = useConfirm();
  const queryClient = useQueryClient();
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [rowSelection, setRowSelection] = useState({});
  const {
    data: userResponse,
    isPending: isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["users", pagination.pageIndex, pagination.pageSize],
    queryFn: () =>
      GET("/user/list", {
        page: pagination.pageIndex,
        limit: pagination.pageSize,
      },token),
  });
  
  const { mutate: Delete, isPending: isDeleting } = useMutation({
    mutationFn: (id: string) => DELETE(`/user/delete/${id}`,token),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
      toast({
        title: "Success!",
        description: `User deleted successfully`,
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

  const { mutate: Deactivate, isPending: isDeactivatiog } = useMutation({
    mutationFn: (id: string) => PUT(`/user/change-status/${id}?status=0`, {},token),
    onSuccess: (data, id) => {
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
      toast({
        color: "green",
        title: "Success!",
        description: `User de activated succefully`,
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

  const { mutate: Activate, isPending: isActivating } = useMutation({
    mutationFn: (id: string) => PUT(`/user/change-status/${id}?status=1`, {},token),
    onSuccess: (data, id) => {
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
      toast({
        color: "green",
        title: "Success!",
        description: `User activated successfully`,
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
  const handleActivate = async (id: string, label?: string) => {
    const confirm = await confirmDelete({
      title: "Confirm activation",
      message: `Are you sure you want to activate ${label}?`,
    });
    if (confirm) {
      Activate(id);
    }
  };

  const handleDeactivate = async (id: string, label?: string) => {
    const confirm = await confirmDelete({
      title: "Confirm deactvation",
      message: `Are you sure you want to deactivate ${label} ?`,
    });
    if (confirm) {
      Deactivate(id);
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
    userResponse,
    isLoading,
    handleActivate,
    handleDeactivate,
    isError,
  };
};

export default UseUsers;
