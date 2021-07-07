import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ModalProps,
} from '@chakra-ui/react';
import { Sensor } from '@prisma/client';
import React, { FC, useMemo } from 'react';
import Select from 'react-select';
import useSWR from 'swr';

const fetcher = (...args: Parameters<typeof fetch>) =>
  fetch(...args)
    .then((res) => res.json())
    .then((response) => response.data);

interface SelectSensorProps extends Omit<ModalProps, 'children'> {
  onClose: (sensorId?: number) => any;
}

export const SelectSensor: FC<SelectSensorProps> = ({ onClose, ...props }) => {
  const { data: sensors, error: sensorsError } = useSWR<Sensor[]>(`/api/sensors`, fetcher);
  const mappedSensors = useMemo(
    () => (sensors ? sensors.map((sensor) => ({ label: `${sensor.name} (${sensor.type})`, value: sensor.id })) : []),
    [sensors],
  );

  return (
    <Modal closeOnOverlayClick={false} isCentered size="xl" {...props} onClose={() => onClose()}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Select a Sensor</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Select options={mappedSensors} onChange={(value) => onClose(value?.value)} />
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" onClick={() => onClose()}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
