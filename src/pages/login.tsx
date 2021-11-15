import {
  Button,
  Center,
  Container,
  Heading,
  Icon,
  Link as ChakraLink,
  Text,
  useBoolean,
} from "@chakra-ui/react";
import { getSession, signIn } from "next-auth/react";
import Image from "next/image";
import { VscGithub } from "react-icons/vsc";
import { GetServerSideProps } from "next";

const Description = () => (
  <Text>
    1337-reports is made only for 1337 students, therefor you need to sign in
    with your 42 intra account. We guarantee to you that we won't use your data
    for anything else other than verify you're one of us, and we won't link any
    report you make with your intra, unless you say so.
    <br />
    You can always check yourself with the source code here{" "}
    <ChakraLink href="https://github.com/estarossa0/1337-reports" isExternal>
      <Icon _hover={{ cursor: "pointer" }} boxSize="20px" as={VscGithub} />
    </ChakraLink>
    .
  </Text>
);

const TextContainer = ({ children }) => (
  <Container
    boxShadow="dark-lg"
    rounded="3xl"
    p="5"
    bg="#333333"
    color="white"
    fontSize={{ base: "xs", md: "lg" }}
    maxW={{ base: "200px", sm: "300px", md: "container.md" }}
  >
    {children}
  </Container>
);

const LoginButton = () => {
  const [loading, { on }] = useBoolean();
  return (
    <Button
      _active={{ transform: "scale(0.9)" }}
      _hover={{ transform: "scale(1.2)" }}
      isLoading={loading}
      onClick={() => {
        on();
        signIn("42-school", { callbackUrl: "/home" });
      }}
      color="white"
      mt="6"
      bg="#34495E"
    >
      <Text pr="4px" mr={1}>
        Log in with
      </Text>
      <Image
        priority
        quality="25"
        layout="intrinsic"
        height="30px"
        width="30px"
        src="https://42.fr/wp-content/uploads/2021/05/42-Final-sigle-seul.svg"
      />
    </Button>
  );
};

const Login = () => {
  return (
    <Center flexDirection="column" h="100vh" as="main">
      <TextContainer>
        <Heading pb="25" textAlign="center">
          Welcome to 1337-reports
        </Heading>
        <Description />
      </TextContainer>
      <LoginButton />
    </Center>
  );
};

const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const session = await getSession({ req });
  if (session) return { redirect: { destination: "/home", permanent: true } };
  return { props: {} };
};

export { Login as default, getServerSideProps };
