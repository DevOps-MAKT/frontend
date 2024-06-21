import React from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from '@nextui-org/react';


const InfoModal = ({ modalObject, title, message }) => {
  return (
    <>
        <Modal backdrop="blur" isOpen={modalObject.isOpen} onOpenChange={modalObject.onOpenChange} onClose={modalObject.onClose}>
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
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </>
  );
};

export default InfoModal;
