import {
  Center,
  HStack,
  Link as ChakraLink,
  Icon,
  Button,
  Avatar,
  SkeletonCircle,
  Skeleton,
  Box,
  Tooltip,
  Text,
} from "@chakra-ui/react";
import { BiHomeAlt, BiMessageSquareDetail } from "react-icons/bi";
import { VscGithub } from "react-icons/vsc";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { useContext } from "react";
import SecretIdContainer from "./secret-id";
import { UserContext } from ".";

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

export { SignBody as default };
