import React from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from '@nextui-org/react';


const ConfirmationModal = ({ modalObject, title, message, callback, callbackStyle, buttonContent }) => {
  return (
    <>
        <Modal backdrop="blur" isOpen={modalObject.isOpen} onOpenChange={modalObject.onOpenChange}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">{title}</ModalHeader>
                <ModalBody>
                  <p>{message}</p>
                </ModalBody>
                <ModalFooter>
                  <Button color="primary" variant="light" onPress={onClose}>
                    Close
                  </Button>
                  <Button type="submit" color={callbackStyle} onClick={callback} >
                    {buttonContent}
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </>
  );
};

export default ConfirmationModal;
