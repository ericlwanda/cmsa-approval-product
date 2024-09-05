import React, { useState } from "react";
import { useConfirm } from "./use-alert-dialog/use-confirm";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { DELETE, GET, POST } from "@/lib/client/client";
import { toast } from "@/components/ui/use-toast";
import { tokenFromSession } from "@/lib/tokenFromSession";

const UsePayments = () => {
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
    queryKey: ["payments", pagination.pageIndex, pagination.pageSize],
    queryFn: () =>
      GET("/payment/list", { page: pagination.pageIndex, limit: pagination.pageSize },token),
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

export default UsePayments;


// {
//     "id": "cm0m1ffi60017rgviryqs2rim",
//     "control_number": "1725344265532-8710",
//     "description": "Applications Fees Control number",
//     "total_amount": 1500000,
//     "payment_status": "PAID",
//     "type": 1,
//     "payment_time": null,
//     "created_at": "2024-09-03T06:17:45.000Z",
//     "updated_at": "2024-09-03T06:17:45.000Z",
//     "archive": 0,
//     "created_by": "cm0m12po2000rrgvio8jixmsb",
//     "updated_by": "cm0m12po2000rrgvio8jixmsb",
//     "application_id": "cm0m1ffbb0012rgvisvg34chz",
//     "applications": {
//         "id": "cm0m1ffbb0012rgvisvg34chz",
//         "trackNumber": "CMSA-1725344265285-848",
//         "license_type_id": "cm0lzmc3f0000wrsp52f3ugku",
//         "created_at": "2024-09-03T06:17:45.000Z",
//         "updated_at": "2024-09-03T06:45:47.000Z",
//         "status": "COMPLETED",
//         "archive": 0,
//         "type": 1,
//         "created_by": "cm0m12po2000rrgvio8jixmsb",
//         "updated_by": "",
//         "user_id": "cm0m12po2000rrgvio8jixmsb",
//         "previous_assignee_id": "cm0m0voqw000brgvi1tmd6a0o",
//         "users": {
//             "id": "cm0m12po2000rrgvio8jixmsb",
//             "name": "Core securities limited",
//             "phone_number": "255255222123",
//             "email": "info@coresecurities.co.tz",
//             "password": "$2a$10$fakg0Zyci2LJzE3Y4TTcjeZYCtS4JiAmwQHoPTYh7hzIYt61h6rAC",
//             "remember_me_code": null,
//             "role": "USER",
//             "created_at": "2024-09-03T06:07:52.000Z",
//             "updated_at": "2024-09-03T06:07:52.000Z",
//             "status": 1,
//             "archive": 0,
//             "created_by": "",
//             "updated_by": "",
//             "company_id": "cm0m12pkq000prgvikilbommf"
//         }
//     }
// }
