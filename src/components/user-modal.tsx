import {
  Avatar,
  Box,
  Button,
  Center,
  HStack,
  Icon,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Skeleton,
  SkeletonCircle,
  Text,
  Tooltip,
  useDisclosure,
  Link as ChakraLink,
} from '@chakra-ui/react';
import { signIn, signOut, useSession } from 'next-auth/react';
import { BiHomeAlt, BiMessageSquareDetail } from 'react-icons/bi';
import { VscGithub } from 'react-icons/vsc';
import { RiListSettingsLine } from 'react-icons/ri';
import Link from 'next/link';

type User = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
};

const UserIcon = ({ isLoaded, user }: { isLoaded: boolean; user: User }) => (
  <SkeletonCircle isLoaded={isLoaded} size="24">
    <Avatar src={user?.image} size="xl" />
  </SkeletonCircle>
);

const UserInfo = ({ user }: { user: User }) => (
  <Box textAlign="center">
    <Text>{user ? 'Signed as:' : 'Not signed'}</Text>
    {user ? <Text>{user.name}</Text> : null}
  </Box>
);

const SignButton = ({ isSigned }: { isSigned: boolean }) => (
  <Button
    my="4"
    color="white"
    bg="#333333"
    _active={{ transform: 'scale(0.9)' }}
    onClick={() =>
      isSigned
        ? signOut({ callbackUrl: '/' })
        : signIn('42-school', { callbackUrl: '/home' })
    }
  >
    {isSigned ? 'sign out' : 'Sign in'}
  </Button>
);

const Tip = ({ labels, children }) => {
  return children.map((child, index) => (
    <Tooltip hasArrow aria-label={child.label} label={labels[index]}>
      <span>{child}</span>
    </Tooltip>
  ));
};

const SignBody = () => {
  const session = useSession();
  let loaded = true;
  if (session.status === 'loading') loaded = false;
  const user = session.data?.user;

  return (
    <Center flexDirection="column">
      <UserIcon isLoaded={loaded} user={user} />
      <Skeleton as={Center} flexDirection="column" isLoaded={loaded}>
        <UserInfo user={user} />
        <SignButton isSigned={user ? true : false} />
        <HStack spacing={3}>
          <Tip labels={['home', 'Messages', 'Github repo']}>
            <Link href="/home" as="/">
              <Icon aria-label="Home page" as={BiHomeAlt} />
            </Link>
            <Link href="/messages" as="/">
              <Icon as={BiMessageSquareDetail} />
            </Link>
            <ChakraLink
              href="https://github.com/estarossa0/1337-reports"
              isExternal
            >
              <Icon as={VscGithub} />
            </ChakraLink>
          </Tip>
        </HStack>
      </Skeleton>
    </Center>
  );
};

const ModalContainer = ({ isOpen, onClose }) => (
  <Modal size="xs" isOpen={isOpen} onClose={onClose}>
    <ModalOverlay />
    <ModalContent>
      <ModalBody>
        <SignBody />
      </ModalBody>
      <ModalCloseButton />
    </ModalContent>
  </Modal>
);

const UserModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <ModalContainer isOpen={isOpen} onClose={onClose} />
      <IconButton
        pos="absolute"
        right="0%"
        size="lg"
        aria-label="tool-kit"
        icon={<RiListSettingsLine />}
        onClick={onOpen}
      />
    </>
  );
};

export { UserModal as default };
