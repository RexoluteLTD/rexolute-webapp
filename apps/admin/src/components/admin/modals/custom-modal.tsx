import React, { FC, Fragment } from "react";
import { Button } from "@rexolute/ui/button";
import { Modal, ModalBody, ModalFooter, ModalHeader, ModalIcon } from "@rexolute/ui/modal";
import { ModalProps } from "@rexolute/types";
import { Info } from "lucide-react";

const CustomModal: FC<ModalProps> = ({ isOpen, onClose }) => {
  {
    /* Custom Content Modal Example */
  }
  return (
    <Fragment>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalIcon className="bg-blue-100 text-blue-600">
          <Info className="h-6 w-6" />
        </ModalIcon>
        <ModalHeader>
          <h2 className="text-xl font-semibold">Custom Content</h2>
        </ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            <p>This modal can contain any custom content you need.</p>
            <div className="bg-muted p-4 rounded-md">
              <code>
                You can add code snippets, images, or any React components here.
              </code>
            </div>
            <div className="flex justify-center">
              <div className="h-20 w-20 bg-gradient-to-r from-green-400 to-blue-500 rounded-full" />
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button onClick={onClose}>Close</Button>
        </ModalFooter>
      </Modal>
    </Fragment>
  );
};

export default CustomModal;
