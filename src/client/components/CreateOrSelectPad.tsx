import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ModalProps,
  VStack,
} from '@chakra-ui/react';
import { Pad } from '@prisma/client';
import React, { FC, useCallback, useMemo, useState } from 'react';
import Select from 'react-select';
import useSWR, { mutate } from 'swr';

const fetcher = (...args: Parameters<typeof fetch>) =>
  fetch(...args)
    .then((res) => res.json())
    .then((response) => response.data);

interface CreateOrSelectPadProps extends Omit<ModalProps, 'children'> {
  onClose: (newPadId?: number) => any;
}

export const CreateOrSelectPad: FC<CreateOrSelectPadProps> = ({ onClose, ...props }) => {
  const { data: pads, error: padsError } = useSWR<Pad[]>(`/api/pads`, fetcher);
  const [name, setName] = useState('');
  const onCreate = useCallback(async () => {
    try {
      const newPad = await (
        await fetch(`/api/pads`, {
          method: 'POST',
          body: JSON.stringify({
            name,
          }),
        })
      ).json();

      mutate(`/api/pads`);
      setName('');

      onClose(newPad.data.id);
    } catch (error) {
      console.log(error);
    }
  }, [name, onClose]);

  const mappedPads = useMemo(() => (pads ? pads.map((pad) => ({ label: pad.name, value: pad.id })) : []), [pads]);

  return (
    <Modal closeOnOverlayClick={false} isCentered size="xl" {...props} onClose={() => onClose()}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Select a Pad</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Select options={mappedPads} onChange={(value) => onClose(value?.value)} />
        </ModalBody>
        <ModalHeader>Or, create new Pad</ModalHeader>
        <ModalBody>
          <VStack>
            <FormControl>
              <FormLabel>Name</FormLabel>
              <Input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
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
