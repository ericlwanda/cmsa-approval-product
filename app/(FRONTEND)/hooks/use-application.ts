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

const UseApplication = () => {
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
    data: Applications,
    isPending: isLoading,
    isError,
  } = useQuery({
    queryKey: ["applications", pagination.pageIndex, pagination.pageSize],
    queryFn: () =>
      GET("/application/list", {
        page: pagination.pageIndex,
        limit: pagination.pageSize,
      },token),
  });

  const { mutate: Delete, isPending: isDeleting } = useMutation({
    mutationFn: (id: string) => DELETE(`/application/delete/${id}`,token),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({
        queryKey: ["applications"],
      });
      toast({
        title: "Success!",
        description: `Application deleted successfully`,
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

  const {
    mutate: submit,
    isPending: isApproving,
    error: approveError,
    isError: isApprovingError,
  } = useMutation({
    mutationFn: (id: string) => PUT(`/application/submit/${id}`, {},token),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["applicationsConfirm"],
      });
      toast({
        title: "Success!",
        description: "Application approved successfully",
      });
      router.push("/admin/applications");
    },
  });

  const {
    mutate: update_info,
    isPending: isUpdatingInfo,
    error: UpdatingInfoError,
    isError: isUpdatingInfoError,
  } = useMutation({
    mutationFn: (id: string) => PUT(`/application/update_info/${id}`, {},token),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["applications"],
      });
      toast({
        title: "Success!",
        description: "Application updated successfully",
      });
      router.push("/admin/applications");
    },
  });



  const {
    mutate: remove,
    isPending: isRemoving,
    error: RemovingInfoError,
    isError: isRemovingInfoError,
  } = useMutation({
    mutationFn: (id: string) => PUT(`/attachments/remove/${id}`, {},token),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["applicationsConfirm"],
      });
      toast({
        title: "Success!",
        description: "Application approved successfully",
      });
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


  const handleApprove = async (id: string) => {
    // alert("reached");
    const approval = await confirmDelete({
      title: "Confirm",
      message: `Are you sure you want to confirm?`,
    });
    if (approval) {
      submit(id);
    }
  };

  const handleUpdate = async (id: string) => {
    // alert("reached");
    const approval = await confirmDelete({
      title: "Confirm",
      message: `Are you sure you want to confirm?`,
    });
    if (approval) {
      update_info(id);
    }
  };


  const handleRemove = async (id: string) => {
    // alert("reached");
    const approval = await confirmDelete({
      title: "Confirm",
      message: `Are you sure you want to Remove?`,
    });
    if (approval) {
      remove(id);
    }
  };

  const handleApproveLicense = async (id: string) => {
    // alert("reached");
    const approval = await confirmDelete({
      title: "Confirm",
      message: `Are you sure you want to confirm?`,
    });
    if (approval) {
      approveLicense(id);
    }
  };

  const handleUpdateInfo = async (id: string) => {

    const approval = await confirmDelete({
      title: "Confirm",
      message: `Are you sure you want to confirm?`,
    });

    console.log("update",approval)

    if (approval) {
      update_info_comply(id);
    }
  };

  //bado
  const {
    mutate: approveLicense,
    isPending: isApprovingLicense,
    error: approveLicenseError,
    isError: isApprovingLicenseError,
  } = useMutation({
    mutationFn: (id: string) => PUT(`/application/approve/${id}`, {},token),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["applicationsView"],
      });
      toast({
        title: "Success!",
        description: "Pre license approved successfully",
      });
    },
  });

  const {
    mutate: update_info_comply,
    isPending: isUpdatingInfoComply,
    error: UpdatingInfoErrorComply,
    isError: isUpdatingInfoErrorComply,
  } = useMutation({
    mutationFn: (id: string) => PUT(`/application/update_info_comply/${id}`, {},token),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["applicationsView"],
      });
      toast({
        title: "Success!",
        description: "Application sent successfully",
      });

      router.push("/admin/applications");
    },
  });
 

  return {
    DeleteDialog,
    confirmDelete,
    handleDelete,
    pagination,
    setPagination,
    rowSelection,
    setRowSelection,
    Applications,
    isLoading,
    submit,
    isApproving,
    isError,
    isApprovingError,
    handleApprove,
    handleApproveLicense,
    handleUpdateInfo,
    handleUpdate,
    isUpdatingInfo,
    isUpdatingInfoError,
    UpdatingInfoError,
    handleRemove,
    isRemoving
  };
};

export default UseApplication;
