import React, { ReactComponentElement, ReactElement } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export interface ModalProps {
  Title: string;
  Description?: string;
  triggerButton?: ReactElement;
  actionButton?: ReactElement;
  content: ReactElement;
  opened?: boolean;
  onChange?: () => void;
}

const Modal = (props: ModalProps) => {
  const {
    Title,
    actionButton,
    content,
    triggerButton,
    Description,
    opened = false,
    onChange,
  } = props;
  return (
    <Dialog open={opened} onOpenChange={onChange}>
      <DialogOverlay className="bg-transparent bg-opacity-0 backdrop-blur-0" />
      <DialogTrigger asChild>{triggerButton}</DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{Title}</DialogTitle>
          <DialogDescription>{Description}</DialogDescription>
        </DialogHeader>
        {content}
      </DialogContent>
    </Dialog>
  );
};

export default Modal;
