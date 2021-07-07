import { AddIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Container,
  Flex,
  HStack,
  Select,
  SimpleGrid,
  Spacer,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { Channel, Job, JobChannel, JobPad, Pad, Sensor, Well } from '@prisma/client';
import { useRouter } from 'next/router';
import React, { FC, useCallback, useMemo } from 'react';
import useSWR, { mutate } from 'swr';
import { CreateOrSelectPad } from '../../../client/components/CreateOrSelectPad';
import { CreateWellForm } from '../../../client/components/CreateWellForm';
import { DeleteButton } from '../../../client/components/DeleteButton';
import { SelectSensor } from '../../../client/components/SelectSensor';

const fetcher = (...args: Parameters<typeof fetch>) =>
  fetch(...args)
    .then((res) => res.json())
    .then((response) => response.data);

export default function JobDetails() {
  const { query } = useRouter();
  const { data: job, error: jobError } = useSWR<Job>(query.id ? `/api/jobs/${query.id}` : null, fetcher);
  const { onOpen, onClose, isOpen } = useDisclosure();
  const router = useRouter();
  const onCreatePadClose = useCallback(
    async (padId?: number) => {
      onClose();

      if (padId) {
        try {
          await (
            await fetch(`/api/jobs/${query.id}/pads`, {
              method: 'POST',
              body: JSON.stringify({
                padId,
              }),
            })
          ).json();

          mutate(`/api/jobs/${query.id}/pads`);
        } catch (error) {
          console.log(error);
        }
      }
    },
    [onClose, query.id],
  );
  const onDeleteJob = useCallback(async () => {
    try {
      await (
        await fetch(`/api/jobs/${query.id}`, {
          method: 'DELETE',
        })
      ).json();

      mutate(`/api/jobs`);
      router.push('/');
    } catch (error) {
      console.log(error);
    }
  }, [query.id, router]);

  if (jobError) return <div>failed to load</div>;
  if (!job) return <div>loading...</div>;

  return (
    <Container maxW="60rem" py="5">
      <Flex justifyContent="center" mb="1">
        <Box>
          <Text color="gray.400" fontSize="xx-small" fontWeight="bold" mb="-1">
            Job
          </Text>
          <HStack alignItems="center">
            <Text fontSize="xl" fontWeight="bold">
              {job.name}
            </Text>
            <Text fontSize="xs" color="gray.400">
              ({job.customer})
            </Text>
          </HStack>
        </Box>
        <Spacer />
        <HStack spacing="3">
          <Button variant="outline" size="xs" fontWeight="bold" leftIcon={<AddIcon />} onClick={onOpen}>
            Pad
          </Button>
          <DeleteButton resource="jobs" id={job.id} warningText="delete this Job" onDelete={onDeleteJob} />
        </HStack>
      </Flex>
      <JobPads jobId={job.id} />
      <CreateOrSelectPad isOpen={isOpen} onClose={onCreatePadClose} />
    </Container>
  );
}

interface JobPadsProps {
  jobId: number;
}

const JobPads: FC<JobPadsProps> = ({ jobId }) => {
  const { data: jobPads, error: jobPadsError } = useSWR<JobPad[]>(`/api/jobs/${jobId}/pads`, fetcher);

  if (jobPadsError) return <div>failed to load</div>;
  if (!jobPads) return <div>loading...</div>;

  return (
    <SimpleGrid minChildWidth="500px" spacing="3">
      {jobPads.map((jobPad) => (
        <JobPadDetails key={jobPad.id} id={jobPad.id} jobId={jobId} padId={jobPad.padId} />
      ))}
    </SimpleGrid>
  );
};

interface JobPadDetailsProps {
  id: number;
  jobId: number;
  padId: number;
}

const JobPadDetails: FC<JobPadDetailsProps> = ({ jobId, padId, id }) => {
  const { data: pad, error: padError } = useSWR<Pad>(`/api/pads/${padId}`, fetcher);
  const { onOpen, onClose, isOpen } = useDisclosure();

  const onCreateWellClose = useCallback(
    async (wellId?: number) => {
      onClose();

      if (wellId) {
        mutate(`/api/pads/${padId}/wells`);
      }
    },
    [onClose, padId],
  );
  const onRemovePad = useCallback(async () => {
    try {
      await (
        await fetch(`/api/jobs/${jobId}/pads/${padId}`, {
          method: 'DELETE',
        })
      ).json();

      mutate(`/api/jobs/${jobId}/pads`);
    } catch (error) {
      console.log(error);
    }
  }, [jobId, padId]);

  if (padError) return <div>failed to load</div>;
  if (!pad) return <div>loading...</div>;

  return (
    <Box bg="gray.300" borderRadius="lg" p="3">
      <Flex justifyContent="center" mb="1">
        <Box>
          <Text color="gray.500" fontSize="xx-small" fontWeight="bold" mb="-1">
            Pad
          </Text>
          <Text fontSize="md">{pad.name}</Text>
        </Box>
        <Spacer />
        <HStack spacing="3">
          <Button variant="outline" size="xs" fontWeight="bold" leftIcon={<AddIcon />} onClick={onOpen}>
            Well
          </Button>
          <DeleteButton resource="jobPads" id={id} warningText="remove the Pad from this Job" onDelete={onRemovePad} />
        </HStack>
      </Flex>
      <PadWells jobId={jobId} padId={padId} />
      <CreateWellForm padId={padId} onClose={onCreateWellClose} isOpen={isOpen} />
    </Box>
  );
};

interface PadWellsProps {
  jobId: number;
  padId: number;
}

const PadWells: FC<PadWellsProps> = ({ jobId, padId }) => {
  const { data: wells, error: wellsError } = useSWR<Well[]>(`/api/pads/${padId}/wells`, fetcher);

  if (wellsError) return <div>failed to load</div>;
  if (!wells) return <div>loading...</div>;

  return (
    <SimpleGrid minChildWidth="250px" spacing="3">
      {wells.map((well) => (
        <WellDetails key={well.id} jobId={jobId} id={well.id} padId={padId} />
      ))}
    </SimpleGrid>
  );
};

interface WellDetailsProps {
  id: number;
  jobId: number;
  padId: number;
}

const WellDetails: FC<WellDetailsProps> = ({ jobId, padId, id }) => {
  const { data: well, error: wellError } = useSWR<Pad>(`/api/wells/${id}`, fetcher);
  const { onOpen, onClose, isOpen } = useDisclosure();
  const onSelectSensorClose = useCallback(
    async (sensorId?: number) => {
      onClose();
      if (!sensorId) return;

      try {
        await (
          await fetch(`/api/jobs/${jobId}/channels`, {
            method: 'POST',
            body: JSON.stringify({
              jobId,
              sensorId,
              wellId: id,
              channel: Channel.UNASSIGNED,
            }),
          })
        ).json();

        mutate(`/api/jobs/${jobId}/channels`);
      } catch (error) {
        console.log(error);
      }
    },
    [id, jobId, onClose],
  );

  const onDeleteWell = useCallback(async () => {
    try {
      await (
        await fetch(`/api/wells/${id}`, {
          method: 'DELETE',
        })
      ).json();

      mutate(`/api/pads/${padId}/wells`);
    } catch (error) {
      console.log(error);
    }
  }, [id, padId]);

  if (wellError) return <div>failed to load</div>;
  if (!well) return <div>loading...</div>;

  return (
    <Box bg="gray.400" borderRadius="lg" color="white" p="3">
      <Flex justifyContent="center" mb="1">
        <Box>
          <Text color="gray.600" fontSize="xx-small" fontWeight="bold" mb="-1">
            Well
          </Text>
          <Text fontSize="md">{well.name}</Text>
        </Box>
        <Spacer />
        <HStack spacing="3">
          <Button variant="outline" size="xs" fontWeight="bold" leftIcon={<AddIcon />} onClick={onOpen}>
            Sensor
          </Button>
          <DeleteButton resource="wells" id={well.id} warningText="delete this well" onDelete={onDeleteWell} />
        </HStack>
      </Flex>
      <JobChannels jobId={jobId} wellId={well.id} />
      <SelectSensor onClose={onSelectSensorClose} isOpen={isOpen} />
    </Box>
  );
};

interface JobChannelsProps {
  wellId: number;
  jobId: number;
}

const JobChannels: FC<JobChannelsProps> = ({ jobId, wellId }) => {
  const { data: channels, error: channelsError } = useSWR<(JobChannel & { Sensor: Sensor | null })[]>(
    `/api/jobs/${jobId}/channels`,
    fetcher,
  );

  const filteredChannels = useMemo(
    () => (channels ? channels.filter((jobChannel) => jobChannel.wellId === wellId).sort((a, b) => a.id - b.id) : []),
    [channels, wellId],
  );

  const onDeleteJobChannel = useCallback(
    async (sensorId: number | null) => {
      if (!sensorId) return;

      try {
        await (
          await fetch(`/api/jobs/${jobId}/channels`, {
            method: 'DELETE',
            body: JSON.stringify({
              wellId,
              sensorId,
            }),
          })
        ).json();

        mutate(`/api/jobs/${jobId}/channels`);
      } catch (error) {
        console.log(error);
      }
    },
    [jobId, wellId],
  );

  const onUpdateJobChannel = useCallback(
    async (sensorId: number | null, channel: Channel) => {
      if (!sensorId) return;

      try {
        await (
          await fetch(`/api/jobs/${jobId}/channels`, {
            method: 'POST',
            body: JSON.stringify({
              wellId,
              sensorId,
              channel,
            }),
          })
        ).json();

        mutate(`/api/jobs/${jobId}/channels`);
      } catch (error) {
        console.log(error);
      }
    },
    [jobId, wellId],
  );

  if (channelsError) return <div>failed to load</div>;
  if (!filteredChannels) return <div>loading...</div>;

  return (
    <SimpleGrid minChildWidth="150px" spacing="3">
      {filteredChannels.map((channel) => (
        <Box key={channel.id} bg="gray.500" borderRadius="lg" color="white" p="3">
          <Flex justifyContent="center" mb="1">
            <Box>
              <Text color="gray.700" fontSize="xx-small" fontWeight="bold" mb="-1">
                {channel.Sensor?.type === 'PIEZO' ? 'Piezo' : 'Strain'} Sensor
              </Text>
              <Text fontSize="md">{channel.Sensor?.name}</Text>
            </Box>
            <Spacer />
            <HStack spacing="3">
              <DeleteButton
                resource="jobChannels"
                id={channel.id}
                warningText="delete this sensor configuration"
                onDelete={() => onDeleteJobChannel(channel.sensorId)}
              />
            </HStack>
          </Flex>
          <Select
            value={channel.channel}
            onChange={(event) => onUpdateJobChannel(channel.sensorId, event.target.value as Channel)}
          >
            <option value="UNASSIGNED">Unassigned</option>
            {channel.Sensor?.type === 'PIEZO' ? (
              <>
                <option value="PIEZO1">Piezo 1</option>
                <option value="PIEZO2">Piezo 2</option>
                <option value="PIEZO3">Piezo 3</option>
                <option value="PIEZO4">Piezo 4</option>
                <option value="PIEZO5">Piezo 5</option>
                <option value="PIEZO6">Piezo 6</option>
                <option value="PIEZO7">Piezo 7</option>
                <option value="PIEZO8">Piezo 8</option>
              </>
            ) : (
              <>
                <option value="STRAIN1">Strain 1</option>
                <option value="STRAIN2">Strain 2</option>
                <option value="STRAIN3">Strain 3</option>
                <option value="STRAIN4">Strain 4</option>
                <option value="STRAIN5">Strain 5</option>
                <option value="STRAIN6">Strain 6</option>
                <option value="STRAIN7">Strain 7</option>
                <option value="STRAIN8">Strain 8</option>
              </>
            )}
          </Select>
        </Box>
      ))}
    </SimpleGrid>
  );
};
