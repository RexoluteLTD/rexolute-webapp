

import { cn } from "@rexolute/utils";
import { AlertTriangle } from "lucide-react";
import { Button } from "@rexolute/ui/button";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalIcon,
} from "@rexolute/ui/modal";
import { FC } from "react";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "warning" | "danger" | "info";
}

const ConfirmationModal: FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Approve",
  cancelText = "Cancel",
  variant = "warning",
}) => {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const getIconStyles = () => {
    switch (variant) {
      case "danger":
        return "bg-red-100 text-red-600";
      case "info":
        return "bg-blue-100 text-blue-600";
      case "warning":
      default:
        return "bg-amber-100 text-amber-600";
    }
  };

  const getButtonStyles = () => {
    switch (variant) {
      case "danger":
        return "bg-red-600 hover:bg-red-700";
      case "info":
        return "bg-blue-600 hover:bg-blue-700";
      case "warning":
      default:
        return "bg-green-600 hover:bg-green-700";
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalIcon className={getIconStyles()}>
        <AlertTriangle className="h-6 w-6" />
      </ModalIcon>
      <ModalHeader>
        <h2 className="text-xl font-semibold">{title}</h2>
      </ModalHeader>
      {description && (
        <ModalBody>
          <p className="text-center text-muted-foreground">{description}</p>
        </ModalBody>
      )}
      <ModalFooter>
        <Button variant="outline" onClick={onClose} className="min-w-[100px]">
          {cancelText}
        </Button>
        <Button
          onClick={handleConfirm}
          className={cn("min-w-[100px]", getButtonStyles())}
        >
          {confirmText}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default ConfirmationModal;
