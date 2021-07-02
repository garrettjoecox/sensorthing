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
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from '@chakra-ui/react';
import { Channel, JobChannel, Sensor, SensorType, Well } from '@prisma/client';
import React, { FC, useCallback, useMemo } from 'react';
import Select from 'react-select/creatable';
import useSWR, { mutate } from 'swr';
import { CreateSensorForm } from './CreateSensorForm';

const possibleChannels: ({ type: SensorType } & Pick<JobChannel, 'channel' | 'sensorId' | 'wellId'>)[] = [
  { channel: 'PIEZO1', type: 'PIEZO', sensorId: null, wellId: null },
  { channel: 'STRAIN1', type: 'STRAIN', sensorId: null, wellId: null },
  { channel: 'PIEZO2', type: 'PIEZO', sensorId: null, wellId: null },
  { channel: 'STRAIN2', type: 'STRAIN', sensorId: null, wellId: null },
  { channel: 'PIEZO3', type: 'PIEZO', sensorId: null, wellId: null },
  { channel: 'STRAIN3', type: 'STRAIN', sensorId: null, wellId: null },
  { channel: 'PIEZO4', type: 'PIEZO', sensorId: null, wellId: null },
  { channel: 'STRAIN4', type: 'STRAIN', sensorId: null, wellId: null },
  { channel: 'PIEZO5', type: 'PIEZO', sensorId: null, wellId: null },
  { channel: 'STRAIN5', type: 'STRAIN', sensorId: null, wellId: null },
  { channel: 'PIEZO6', type: 'PIEZO', sensorId: null, wellId: null },
  { channel: 'STRAIN6', type: 'STRAIN', sensorId: null, wellId: null },
  { channel: 'PIEZO7', type: 'PIEZO', sensorId: null, wellId: null },
  { channel: 'STRAIN7', type: 'STRAIN', sensorId: null, wellId: null },
  { channel: 'PIEZO8', type: 'PIEZO', sensorId: null, wellId: null },
  { channel: 'STRAIN8', type: 'STRAIN', sensorId: null, wellId: null },
];

interface ConfigureChannelsFormProps extends Omit<ModalProps, 'children'> {
  jobId?: string;
}

const fetcher = (...args: Parameters<typeof fetch>) =>
  fetch(...args)
    .then((res) => res.json())
    .then((response) => response.data);

export const ConfigureChannelsForm: FC<ConfigureChannelsFormProps> = ({ jobId, ...props }) => {
  const { isOpen: isCreateSensorOpen, onOpen: onCreateSensorOpen, onClose: onCreateSensorClose } = useDisclosure();
  const { data: wells, error: wellsError } = useSWR<Well[]>('/api/wells', fetcher);
  const { data: sensors, error: sensorsError } = useSWR<Sensor[]>('/api/sensors', fetcher);
  const { data: channels, error: channelsError } = useSWR<JobChannel[]>(
    jobId ? `/api/jobs/${jobId}/channels` : null,
    fetcher,
  );

  const wellsOptions = useMemo(() => (wells || []).map((well) => ({ label: well.name, value: well.id })), [wells]);
  const piezoSensorsOptions = useMemo(
    () =>
      (sensors || [])
        .filter((sensor) => sensor.type === 'PIEZO')
        .map((sensor) => ({ label: sensor.name, value: sensor.id })),
    [sensors],
  );
  const strainSensorsOptions = useMemo(
    () =>
      (sensors || [])
        .filter((sensor) => sensor.type === 'STRAIN')
        .map((sensor) => ({ label: sensor.name, value: sensor.id })),
    [sensors],
  );

  const mappedChannels = useMemo(() => {
    return possibleChannels.map((possibleChannel) => {
      const found = channels?.find((ch) => ch.channel === possibleChannel.channel);

      return {
        ...possibleChannel,
        wellId: found?.wellId,
        sensorId: found?.sensorId,
      };
    });
  }, [channels]);

  const onWellCreate = useCallback(
    async ({ name, channel }: { name: string; channel: Channel }) => {
      try {
        const { data: newWell } = await (
          await fetch('/api/wells', { method: 'POST', body: JSON.stringify({ name }) })
        ).json();
        mutate('/api/wells');

        await (
          await fetch(`/api/jobs/${jobId}/channels/${channel}`, {
            method: 'PATCH',
            body: JSON.stringify({ wellId: newWell.id }),
          })
        ).json();
        mutate(`/api/jobs/${jobId}/channels`);
      } catch (error) {
        console.log(error);
      }
    },
    [jobId],
  );

  const onWellChange = useCallback(
    async ({ wellId, channel }: { wellId: string; channel: Channel }) => {
      try {
        await (
          await fetch(`/api/jobs/${jobId}/channels/${channel}`, {
            method: 'PATCH',
            body: JSON.stringify({ wellId }),
          })
        ).json();
        mutate(`/api/jobs/${jobId}/channels`);
      } catch (error) {
        console.log(error);
      }
    },
    [jobId],
  );

  const onSensorCreate = useCallback(
    ({ name, channel }: { name: string; channel: Channel }) => {
      onCreateSensorOpen();
    },
    [jobId],
  );

  const onSensorChange = useCallback(
    async ({ sensorId, channel }: { sensorId: string; channel: Channel }) => {
      try {
        await (
          await fetch(`/api/jobs/${jobId}/channels/${channel}`, {
            method: 'PATCH',
            body: JSON.stringify({ sensorId }),
          })
        ).json();
        mutate(`/api/jobs/${jobId}/channels`);
      } catch (error) {
        console.log(error);
      }
    },
    [jobId],
  );

  if (channelsError) return <div>failed to load</div>;
  if (!channels) return <div>loading...</div>;

  return (
    <Modal closeOnOverlayClick={false} isCentered size="full" scrollBehavior="inside" {...props}>
      <ModalOverlay />
      <ModalContent width="50rem">
        <ModalHeader>Configure Channels</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <CreateSensorForm isOpen={isCreateSensorOpen} onClose={onCreateSensorClose} />
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Channel</Th>
                <Th>Well</Th>
                <Th>Sensor</Th>
              </Tr>
            </Thead>
            <Tbody>
              {mappedChannels.map((channel) => (
                <Tr key={channel.channel}>
                  <Td>{channel.channel}</Td>
                  <Td>
                    <Select
                      options={wellsOptions}
                      value={channel.wellId ? wellsOptions.find((well) => well.value === channel.wellId) : null}
                      onCreateOption={(name) => onWellCreate({ name, channel: channel.channel })}
                      onChange={(input) =>
                        input?.value &&
                        onWellChange({ wellId: input.value as unknown as string, channel: channel.channel })
                      }
                    />
                  </Td>
                  <Td>
                    <Select
                      options={channel.type === 'PIEZO' ? piezoSensorsOptions : strainSensorsOptions}
                      value={
                        channel.sensorId
                          ? (channel.type === 'PIEZO' ? piezoSensorsOptions : strainSensorsOptions).find(
                              (sensor) => sensor.value === channel.sensorId,
                            )
                          : null
                      }
                      onCreateOption={(name) => onSensorCreate({ name, channel: channel.channel })}
                      onChange={(input) =>
                        input?.value &&
                        onSensorChange({ sensorId: input.value as unknown as string, channel: channel.channel })
                      }
                    />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" onClick={props.onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
