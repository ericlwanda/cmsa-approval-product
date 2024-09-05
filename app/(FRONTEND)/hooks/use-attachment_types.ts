import React, { useState } from "react";
import { useConfirm } from "./use-alert-dialog/use-confirm";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { DELETE, GET, POST } from "@/lib/client/client";
import { toast } from "@/components/ui/use-toast";
import { tokenFromSession } from "@/lib/tokenFromSession";

const UseAttachmentTypes = () => {
  const token = tokenFromSession();
  const [DeleteDialog, confirmDelete] = useConfirm();
  const queryClient = useQueryClient();
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [rowSelection, setRowSelection] = useState({});



  const { mutate: Delete, isPending: isDeleting } = useMutation({
    mutationFn: (id: string) => DELETE(`/attachment-type/delete/${id}`,token),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({
        queryKey: ["attachmentTypes"],
      });
      toast({
        title: "Success!",
        description: `Attachment type deleted successfully`,
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
    setRowSelection
  };
};

export default UseAttachmentTypes;
