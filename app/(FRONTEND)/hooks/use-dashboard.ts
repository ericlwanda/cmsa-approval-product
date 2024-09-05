import { useState } from "react";
import {useQuery, useQueryClient } from "@tanstack/react-query";
import { GET} from "@/lib/client/client";
import { tokenFromSession } from "@/lib/tokenFromSession";

const UseDashboard = () => {
  const token = tokenFromSession();
  const queryClient = useQueryClient();
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [rowSelection, setRowSelection] = useState({});
  const {
    data: dashboard,
    isPending: isLoading,
    isError
  } = useQuery({
    queryKey: ["dashboard"],
    queryFn: () =>
      GET("/dashboard", { page: pagination.pageIndex, limit: pagination.pageSize },token),
  });



  return {
    pagination,
    setPagination,
    rowSelection,
    setRowSelection,
    dashboard,
    isLoading,
    isError
  };
};

export default UseDashboard;

