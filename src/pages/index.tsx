import {
  Box,
  Button,
  Flex,
  Text,
  Container,
  Spacer,
  useBoolean,
} from '@chakra-ui/react';
import ParticlesBackground from '../components/particles-background';
import Link from 'next/link';

const Title = () => {
  const [loading, { on }] = useBoolean();

  return (
    <Flex flexDirection="column" alignItems="center" mt="7">
      <Text whiteSpace="nowrap" fontSize={{ base: '45', lg: '90' }}>
        1337-reports
      </Text>
      <Text
        color="white"
        bg="#333333"
        p="1"
        borderRadius="md"
        fontSize={{ base: '10', md: '15' }}
      >
        1337-reports is a platform made so you can report things to a<br />
        specific staff member or the whole bocal{' '}
        <Text as="span" fontWeight="bold">
          privately
        </Text>
        .
      </Text>
      <Link href="/login">
        <Button
          onClick={() => on()}
          _active={{ transform: 'scale(0.9)' }}
          _hover={{ transform: 'scale(1.1)' }}
          isLoading={loading}
          mt="12"
          size="md"
          color="white"
          bg="gray.600"
        >
          Start a report
        </Button>
      </Link>
    </Flex>
  );
};

const Example = () => {
  return (
    <Box w="550px" h="600px" bgColor="red">
      <Text>EXAMPLE</Text>
    </Box>
  );
};

const Index = () => (
  <Box as="main" w="100vw" h="100vh">
    <ParticlesBackground />
    <Container top="15%" pos="relative" maxW="container.xl">
      <Flex>
        <Title />
        <Spacer />
        <Example />
      </Flex>
    </Container>
  </Box>
);

export default Index;