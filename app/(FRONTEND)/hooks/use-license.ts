import React, { useState } from "react";
import { useConfirm } from "./use-alert-dialog/use-confirm";
import {
  useMutation,
  useQuery,
  useQueryClient,
  useQueryErrorResetBoundary,
} from "@tanstack/react-query";
import { DELETE, GET, POST, PUT } from "@/lib/client/client";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { tokenFromSession } from "@/lib/tokenFromSession";

const UseLicense = () => {
  const token = tokenFromSession();
  const router = useRouter();
  const [DeleteDialog, confirmDelete] = useConfirm();
  const queryClient = useQueryClient();
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [rowSelection, setRowSelection] = useState({});
  const {
    data: licenses,
    isPending: isLoading,
    isError,
  } = useQuery({
    queryKey: ["license", pagination.pageIndex, pagination.pageSize],
    queryFn: () =>
      GET("/license/list", {
        page: pagination.pageIndex,
        limit: pagination.pageSize,
      },token),
  });


  return {
    DeleteDialog,
    confirmDelete,
    pagination,
    setPagination,
    rowSelection,
    setRowSelection,
    licenses,
    isLoading,
    isError,

  };
};

export default UseLicense;