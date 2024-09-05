import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
export const useConfirm = () => {
  const [title, setTitle] = useState<string>("Confirm!");
  const [message, setMessage] = useState<string>(
    "Are you sure you want to continue?"
  );
  //promise
  const [promise, setPromise] = useState<{
    resolve: (value: boolean) => void;
    reject?: () => void;
  } | null>(null);

  const confirm = (props: { title?: string; message?: string }) =>
    new Promise<boolean | null>((resolve, reject) => {
      if (props.title) setTitle(props.title);
      if (props.message) setMessage(props.message);
      setPromise({ resolve });
    });

  const handleClose = () => {
    setPromise(null);
  };

  const handleConfirm = () => {
    promise?.resolve(true);

    handleClose();
  };

  const handleCancel = () => {
    promise?.resolve(false);
    handleClose();
  };
  const ConfirmationDialog = () => (
    <AlertDialog open={!!promise}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{message}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
  return [ConfirmationDialog, confirm];
};
