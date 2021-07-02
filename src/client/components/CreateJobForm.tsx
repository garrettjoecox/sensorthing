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
import React, { FC, useCallback, useState } from 'react';
import { mutate } from 'swr';

interface CreateJobFormProps extends Omit<ModalProps, 'children'> {}

export const CreateJobForm: FC<CreateJobFormProps> = ({ ...props }) => {
  const [name, setName] = useState('');
  const [customer, setCustomer] = useState('');
  const [startsAt, setStartsAt] = useState(new Date().toString());
  const [endsAt, setEndsAt] = useState(new Date(Date.now() + 100000).toString());
  const onCreate = useCallback(async () => {
    try {
      await (
        await fetch(`/api/jobs`, {
          method: 'POST',
          body: JSON.stringify({
            name,
            customer,
            startedAt: startsAt,
            endedAt: endsAt,
          }),
        })
      ).json();
      mutate(`/api/jobs`);

      props.onClose();
    } catch (error) {
      console.log(error);
    }
  }, [props]);

  return (
    <Modal closeOnOverlayClick={false} isCentered size="xl" scrollBehavior="inside" {...props}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create new Job</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack>
            <FormControl>
              <FormLabel>Name</FormLabel>
              <Input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
            </FormControl>
            <FormControl>
              <FormLabel>Customer</FormLabel>
              <Input placeholder="Customer" value={customer} onChange={(e) => setCustomer(e.target.value)} />
            </FormControl>
            <FormControl>
              <FormLabel>Starts At</FormLabel>
              <Input
                type="date"
                placeholder="Starts At"
                value={startsAt}
                onChange={(e) => setStartsAt(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Ends At</FormLabel>
              <Input type="date" placeholder="Ends At" value={endsAt} onChange={(e) => setEndsAt(e.target.value)} />
            </FormControl>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onCreate}>
            Create
          </Button>
          <Button variant="ghost" onClick={props.onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
