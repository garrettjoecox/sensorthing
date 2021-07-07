import { DeleteIcon } from '@chakra-ui/icons';
import {
  Button,
  IconButton,
  Modal,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from '@chakra-ui/react';
import React, { FC } from 'react';

interface DeleteButtonProps {
  resource: 'jobs' | 'jobPads' | 'pads' | 'wells' | 'jobChannels';
  id: number;
  warningText?: string;
  onDelete?: (id: number) => any;
}

export const DeleteButton: FC<DeleteButtonProps> = ({ warningText = 'do this', onDelete, id }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <IconButton
        aria-label="delete"
        variant="outline"
        size="xs"
        borderRadius="md"
        fontWeight="bold"
        icon={<DeleteIcon />}
        onClick={onOpen}
      />
      <Modal onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Are you sure you want to {warningText}?</ModalHeader>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button
              colorScheme="blue"
              onClick={() => {
                onDelete?.(id);
                onClose();
              }}
            >
              Confirm
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
