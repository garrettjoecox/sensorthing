import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ModalProps,
  VStack,
} from '@chakra-ui/react';
import React, { FC, useCallback, useState } from 'react';
import { mutate } from 'swr';

interface CreateWellFormProps extends Omit<ModalProps, 'children'> {
  onClose: (newWellId?: number) => any;
  padId: number;
}

export const CreateWellForm: FC<CreateWellFormProps> = ({ onClose, padId, ...props }) => {
  const [name, setName] = useState('');
  const [api, setApi] = useState('');
  const onCreate = useCallback(async () => {
    try {
      const newWell = await (
        await fetch(`/api/wells`, {
          method: 'POST',
          body: JSON.stringify({
            name,
            api,
            padId,
          }),
        })
      ).json();

      mutate(`/api/wells`);
      setName('');
      setApi('');

      onClose(newWell.data.id);
    } catch (error) {
      console.log(error);
    }
  }, [api, name, onClose, padId]);

  return (
    <Modal closeOnOverlayClick={false} isCentered size="xl" {...props} onClose={() => onClose()}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create new Well</ModalHeader>
        <ModalBody>
          <VStack>
            <FormControl>
              <FormLabel>Name</FormLabel>
              <Input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
            </FormControl>
            <FormControl>
              <FormLabel>API</FormLabel>
              <Input placeholder="API" value={api} onChange={(e) => setApi(e.target.value)} />
            </FormControl>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onCreate}>
            Create
          </Button>
          <Button variant="ghost" onClick={() => onClose()}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
