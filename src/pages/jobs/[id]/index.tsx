import {
  Button,
  Center,
  Container,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from '@chakra-ui/react';
import { Job, JobChannel } from '@prisma/client';
import { format } from 'date-fns';
import { useRouter } from 'next/router';
import React from 'react';
import useSWR from 'swr';

const fetcher = (...args: Parameters<typeof fetch>) =>
  fetch(...args)
    .then((res) => res.json())
    .then((response) => response.data);

const possibleChannels: Partial<JobChannel>[] = [
  { channel: 'PIEZO1' },
  { channel: 'STRAIN1' },
  { channel: 'PIEZO2' },
  { channel: 'STRAIN2' },
  { channel: 'PIEZO3' },
  { channel: 'STRAIN3' },
  { channel: 'PIEZO4' },
  { channel: 'STRAIN4' },
  { channel: 'PIEZO5' },
  { channel: 'STRAIN5' },
  { channel: 'PIEZO6' },
  { channel: 'STRAIN6' },
  { channel: 'PIEZO7' },
  { channel: 'STRAIN7' },
  { channel: 'PIEZO8' },
  { channel: 'STRAIN8' },
];

export default function JobDetails() {
  const { query } = useRouter();
  const { data: job, error: jobError } = useSWR<Job>(query.id ? `/api/jobs/${query.id}` : null, fetcher);
  const { isOpen: isChannelsOpen, onOpen: onChannelsOpen, onClose: onChannelsClose } = useDisclosure();
  const { data: channels, error: channelsError } = useSWR<JobChannel[]>(
    query.id ? `/api/jobs/${query.id}/channels` : null,
    fetcher,
  );

  if (jobError || channelsError) return <div>failed to load</div>;
  if (!job || !channels) return <div>loading...</div>;

  return (
    <Container maxW="60rem" p="10">
      <HStack justifyContent="flex-end">
        <Button>Edit Job Details</Button>
        <Button onClick={onChannelsOpen}>Configure Channels</Button>
        <Modal
          isOpen={isChannelsOpen}
          onClose={onChannelsClose}
          closeOnOverlayClick={false}
          isCentered
          size="xl"
          scrollBehavior="inside"
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Configure Channels</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Channel</Th>
                    <Th>Well</Th>
                    <Th>Sensor</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {possibleChannels.map((channel) => (
                    <Tr key={channel.channel}>
                      <Td>{channel.channel}</Td>
                      <Td>
                        <Input />
                      </Td>
                      <Td>
                        <Input />
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </ModalBody>

            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={onChannelsClose}>
                Save
              </Button>
              <Button variant="ghost" onClick={onChannelsClose}>
                Cancel
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </HStack>
      <Table mb="10" variant="simple">
        <Thead>
          <Tr>
            <Th>ID</Th>
            <Th>Name</Th>
            <Th>Customer</Th>
            <Th>Starts At</Th>
            <Th>Ends At</Th>
          </Tr>
        </Thead>
        <Tbody>
          <Tr>
            <Td>{job.id}</Td>
            <Td>{job.name}</Td>
            <Td>{job.customer}</Td>
            <Td>{job.startedAt && format(new Date(job.startedAt), 'MM/dd/yyyy')}</Td>
            <Td>{job.endedAt && format(new Date(job.endedAt), 'MM/dd/yyyy')}</Td>
          </Tr>
        </Tbody>
      </Table>
      <Center bg="red.500" borderRadius="lg" height="50vh" color="white">
        Visualization Stuff
      </Center>
    </Container>
  );
}
