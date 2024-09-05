import React, { useState } from "react";
import { useConfirm } from "./use-alert-dialog/use-confirm";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { DELETE, GET, POST } from "@/lib/client/client";
import { toast } from "@/components/ui/use-toast";
import { tokenFromSession } from "@/lib/tokenFromSession";

const UseReports = () => {
  const token = tokenFromSession();
  const queryClient = useQueryClient();
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [rowSelection, setRowSelection] = useState({});
  const {
    data: payments,
    isPending: isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["licenseTypes", pagination.pageIndex, pagination.pageSize],
    queryFn: () =>
      GET("/license-type/page", { page: pagination.pageIndex, limit: pagination.pageSize },token),
  });



  return {
    pagination,
    setPagination,
    rowSelection,
    setRowSelection,
    payments,
    isLoading,
    isError
  };
};

export default UseReports;
