import {
  Box,
  Center,
  Container,
  Heading,
  VStack,
  Icon,
  Text,
} from "@chakra-ui/react";
import { GetServerSideProps } from "next";
import { BiErrorCircle } from "react-icons/bi";

const Header = () => (
  <>
    <Heading size="lg" color="red" fontWeight="bold">
      <Icon
        pos="relative"
        bottom="4px"
        mr="7fpx"
        boxSize="35px"
        as={BiErrorCircle}
        color="red"
      />
      Error
    </Heading>
  </>
);

const CallbackError = () => (
  <Text pt="4">Authorization failed. maybe try again</Text>
);

const DefaultError = ({ type }) => <Text>Default error. type {type}</Text>;

const AccessDeniedError = () => (
  <Text>
    <Text as="span" fontWeight="bold">
      Access denied
    </Text>
    , you're NOT authorized to use this service, made only for 1337 khouribga
    students. Consider forking..
  </Text>
);

const ErrorBody = ({ type }) => {
  if (type === "Callback") return <CallbackError />;
  if (type === "AccessDenied") return <AccessDeniedError />;
  return <DefaultError type={type} />;
};

const Index = ({ query }) => {
  return (
    <Box as="main" w="100vw" h="100vh">
      <Container top="30%" pos="relative" alignItems="center">
        <Center>
          <Box
            rounded="2xl"
            textAlign="center"
            p="4"
            w="300px"
            h="200px"
            bg="gray.50"
            shadow="2xl"
          >
            <VStack spacing={6}>
              <Header />
              <ErrorBody type={query?.error} />
            </VStack>
          </Box>
        </Center>
      </Container>
    </Box>
  );
};

const getServerSideProps: GetServerSideProps = async ({ query }) => {
  return { props: { query } };
};
export { Index as default, getServerSideProps };
