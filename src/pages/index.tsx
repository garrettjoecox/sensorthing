import { SearchIcon } from '@chakra-ui/icons';
import {
  Button,
  Container,
  FormControl,
  FormLabel,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
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
  VStack,
} from '@chakra-ui/react';
import { Job } from '@prisma/client';
import { format } from 'date-fns';
import Link from 'next/link';
import React from 'react';
import useSWR from 'swr';

const fetcher = (...args: Parameters<typeof fetch>) =>
  fetch(...args)
    .then((res) => res.json())
    .then((response) => response.data);

export default function Index() {
  const { data, error } = useSWR<Job[]>('/api/jobs', fetcher);
  const { isOpen, onOpen, onClose } = useDisclosure();

  if (error) return <div>failed to load</div>;
  if (!data) return <div>loading...</div>;

  return (
    <Container maxW="60rem" p="10">
      <HStack mb="10">
        <InputGroup>
          <InputLeftElement pointerEvents="none">
            <SearchIcon color="gray.300" />
          </InputLeftElement>
          <Input placeholder="Search Jobs" />
        </InputGroup>
        <Button colorScheme="blue" onClick={onOpen}>
          Create Job
        </Button>
        <Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={false} isCentered size="xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Create new Job</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack>
                <FormControl>
                  <FormLabel>ID</FormLabel>
                  <Input autoFocus placeholder="ID" />
                </FormControl>
                <FormControl>
                  <FormLabel>Name</FormLabel>
                  <Input placeholder="Name" />
                </FormControl>
                <FormControl>
                  <FormLabel>Customer</FormLabel>
                  <Input placeholder="Customer" />
                </FormControl>
                <FormControl>
                  <FormLabel>Starts At</FormLabel>
                  <Input type="date" placeholder="Starts At" />
                </FormControl>
                <FormControl>
                  <FormLabel>Ends At</FormLabel>
                  <Input type="date" placeholder="Ends At" />
                </FormControl>
              </VStack>
            </ModalBody>

            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={onClose}>
                Create
              </Button>
              <Button variant="ghost" onClick={onClose}>
                Cancel
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </HStack>
      <Table variant="simple">
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
          {data.map((job) => (
            <Link key={job.id} passHref href={`/jobs/${job.id}`}>
              <Tr as="a" display="table-row">
                <Td>{job.id}</Td>
                <Td>{job.name}</Td>
                <Td>{job.customer}</Td>
                <Td>{job.startedAt && format(new Date(job.startedAt), 'MM/dd/yyyy')}</Td>
                <Td>{job.endedAt && format(new Date(job.endedAt), 'MM/dd/yyyy')}</Td>
              </Tr>
            </Link>
          ))}
        </Tbody>
      </Table>
    </Container>
  );
}
