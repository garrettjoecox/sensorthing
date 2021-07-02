import { Button, Center, Container, HStack, Table, Tbody, Td, Th, Thead, Tr, useDisclosure } from '@chakra-ui/react';
import { Job, JobChannel } from '@prisma/client';
import { format } from 'date-fns';
import { useRouter } from 'next/router';
import React from 'react';
import useSWR from 'swr';
import { ConfigureChannelsForm } from '../../../client/components/ConfigureChannelsForm';

const fetcher = (...args: Parameters<typeof fetch>) =>
  fetch(...args)
    .then((res) => res.json())
    .then((response) => response.data);

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
        <ConfigureChannelsForm jobId={query.id as string} isOpen={isChannelsOpen} onClose={onChannelsClose} />
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
