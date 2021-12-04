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
  useBoolean,
  Link as ChakraLink,
  Input,
  useClipboard,
} from "@chakra-ui/react";
import { signIn, signOut, useSession } from "next-auth/react";
import { BiHomeAlt, BiMessageSquareDetail } from "react-icons/bi";
import { VscGithub } from "react-icons/vsc";
import { RiListSettingsLine } from "react-icons/ri";
import Link from "next/link";
import { createContext, useContext, useState } from "react";
import { atomWithStorage } from "jotai/utils";
import { useAtom } from "jotai";
import { v4 as uuidv4, validate as uuidValidate } from "uuid";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import ErrorBox from "./submit/submit-error";

const UserContext = createContext(undefined);
const secretAtom = atomWithStorage("secretId", null);

const UserIcon = ({ isLoaded }: { isLoaded: boolean }) => {
  const user = useContext(UserContext);

  return (
    <SkeletonCircle isLoaded={isLoaded} size="24">
      <Avatar src={user?.image} size="xl" />
    </SkeletonCircle>
  );
};

const UserInfo = () => {
  const user = useContext(UserContext);

  return (
    <Box textAlign="center">
      <Text>{user ? "Signed as:" : "Not signed"}</Text>
      {user ? <Text>{user.name}</Text> : null}
    </Box>
  );
};

const SignButton = () => {
  const user = useContext(UserContext);

  return (
    <Button
      my="4"
      color="white"
      bg="#333333"
      _active={{ transform: "scale(0.9)" }}
      onClick={() =>
        user
          ? signOut({ callbackUrl: "/" })
          : signIn("42-school", { callbackUrl: "/home" })
      }
    >
      {user ? "sign out" : "Sign in"}
    </Button>
  );
};

const Tip = ({ labels, children }) => {
  return children.map((child, index) => (
    <Tooltip hasArrow aria-label={child.label} label={labels[index]}>
      <span>{child}</span>
    </Tooltip>
  ));
};

const SecretIdNotfound = ({ setSecretId }) => {
  const [state, setState] = useState<"initial" | "options" | "input">(
    "initial",
  );
  const [isLoading, setIsLoading] = useBoolean();

  const buttonProps = {
    _hover: { color: "white", bgColor: "red" },
    h: "full",
    fontSize: "sm",
    color: "red",
  };

  if (state === "options") {
    return (
      <>
        <Button
          isLoading={isLoading}
          onClick={() => {
            setIsLoading.on();
            setSecretId(uuidv4());
          }}
          borderRadius="4px 0px 0px 4px"
          {...buttonProps}
        >
          Generate new
        </Button>
        <Button
          onClick={() => setState("input")}
          isDisabled={isLoading}
          borderRadius="0px 4px 4px 0px"
          {...buttonProps}
        >
          Add old one
        </Button>
      </>
    );
  } else if (state === "initial")
    return (
      <Button
        fontSize="xs"
        m="0"
        h="fit-content"
        onClick={() => setState("options")}
        textAlign="center"
        color="red"
        p="5px"
      >
        You don't have secret ID click to setup
      </Button>
    );
  else if (state === "input") {
    return (
      <Formik
        initialValues={{ input: "" }}
        validationSchema={Yup.object({
          input: Yup.string()
            .required("Insert your uuidv4 secret key")
            .test("uuid", "Not a valid uuidv4", (value) => uuidValidate(value)),
        })}
        onSubmit={({ input }) => setSecretId(input)}
      >
        <Form>
          <Field
            spellCheck="false"
            type=""
            name="input"
            as={Input}
            variant="unstyled"
            p="5px"
            autoComplete="off"
          />
          <Box pos="absolute">
            <ErrorBox name="input" />
          </Box>
        </Form>
      </Formik>
    );
  }
};

const SecretIdFound = () => {
  const [hovering, setHoving] = useBoolean();
  const [secretId, setSecretId] = useAtom(secretAtom);
  const { onCopy } = useClipboard(secretId);

  const buttonProps = {
    onMouseEnter: () => {
      setHoving.on();
    },
    onMouseLeave: () => {
      setHoving.off();
    },
    h: "full",
    fontSize: "sm",
  };

  if (hovering) {
    return (
      <>
        <Button
          onClick={onCopy}
          color="yellow.400"
          _hover={{ color: "white", bgColor: "yellow.400" }}
          borderRadius="4px 0px 0px 4px"
          {...buttonProps}
        >
          Copy
        </Button>
        <Button
          onClick={() => setSecretId(null)}
          color="red"
          _hover={{ color: "white", bgColor: "red" }}
          borderRadius="0px 4px 4px 0px"
          {...buttonProps}
        >
          Delete
        </Button>
      </>
    );
  }
  return (
    <Button
      onClick={setHoving.on}
      onMouseLeave={setHoving.off}
      onMouseEnter={setHoving.on}
      fontSize="xs"
      m="0"
      h="fit-content"
      textAlign="center"
      color="green"
      p="5px"
    >
      Secret set, click for options
    </Button>
  );
};

const SecretId = () => {
  const [secretId, setSecretId] = useAtom(secretAtom);

  if (secretId === null) {
    return <SecretIdNotfound setSecretId={setSecretId} />;
  } else return <SecretIdFound />;
};
const SecretIdContainer = () => {
  const user = useContext(UserContext);
  const [secretId] = useAtom(secretAtom);

  if (!user) return null;

  return (
    <Center
      mt="5px"
      mb="12px"
      shadow="md"
      border="1px solid"
      borderColor={secretId ? "green" : "red"}
      rounded="6px"
      textAlign="center"
      fontSize="sm"
      width="full"
      height="31px"
    >
      <SecretId />
    </Center>
  );
};

const SignBody = () => {
  const session = useSession();
  let loaded = true;
  if (session.status === "loading") loaded = false;

  return (
    <Center flexDirection="column">
      <UserIcon isLoaded={loaded} />
      <Skeleton as={Center} flexDirection="column" isLoaded={loaded}>
        <UserInfo />
        <SecretIdContainer />
        <SignButton />
        <HStack spacing={3}>
          <Tip labels={["home", "Messages", "Github repo"]}>
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

const ModalContainer = ({ isOpen, onClose }) => {
  const session = useSession();
  const user = session.data?.user;

  return (
    <Modal size="xs" isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalBody>
          <UserContext.Provider value={user}>
            <SignBody />
          </UserContext.Provider>
        </ModalBody>
        <ModalCloseButton />
      </ModalContent>
    </Modal>
  );
};

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
