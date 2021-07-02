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
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
  VStack,
} from '@chakra-ui/react';
import { SensorType } from '@prisma/client';
import React, { FC, useCallback, useState } from 'react';
import { mutate } from 'swr';

interface CreateSensorFormProps extends Omit<ModalProps, 'children'> {}

export const CreateSensorForm: FC<CreateSensorFormProps> = ({ ...props }) => {
  const [name, setName] = useState('');
  const [type, setType] = useState<SensorType>('PIEZO');
  const [balance, setBalance] = useState(1.0);
  const [sensitivity, setSensitivity] = useState(1.0);
  const [sampleRate, setSampleRate] = useState(1000);
  const onCreate = useCallback(async () => {
    try {
      await (
        await fetch(`/api/sensors`, {
          method: 'POST',
          body: JSON.stringify({
            name,
            type,
            balance,
            sensitivity,
            sampleRate,
          }),
        })
      ).json();
      mutate(`/api/sensors`);

      props.onClose();
    } catch (error) {
      console.log(error);
    }
  }, [props]);

  return (
    <Modal closeOnOverlayClick={false} isCentered size="xl" scrollBehavior="inside" {...props}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create new Sensor</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack>
            <FormControl>
              <FormLabel>Name</FormLabel>
              <Input autoFocus placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
            </FormControl>
            <FormControl>
              <FormLabel>Type</FormLabel>
              <Select value={type} onChange={(e) => setType(e.target.value as SensorType)}>
                <option value="PIEZO">Piezo</option>
                <option value="STRAIN">Strain</option>
              </Select>
            </FormControl>
            <FormControl>
              <FormLabel>Balance</FormLabel>
              <NumberInput
                defaultValue={1}
                precision={8}
                step={0.2}
                value={balance}
                onChange={(_, value) => setBalance(value)}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>
            <FormControl>
              <FormLabel>Sensitivity</FormLabel>
              <NumberInput
                defaultValue={1}
                precision={8}
                step={0.2}
                value={sensitivity}
                onChange={(_, value) => setSensitivity(value)}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>
            <FormControl>
              <FormLabel>Sample Rate</FormLabel>
              <NumberInput
                defaultValue={1000}
                step={1000}
                value={sampleRate}
                onChange={(_, value) => setSampleRate(value)}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
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
