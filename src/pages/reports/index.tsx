import { AxiosRequestHeaders } from "axios";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import { dehydrate, QueryClient, useQuery } from "react-query";
import { getReports } from "../../lib/api-services";
import { authUser } from "../api/auth/[...nextauth]";
import { Report as ReportType } from "@prisma/client";
import {
  Box,
  Container,
  VStack,
  Text,
  Skeleton,
  LinkBox,
  LinkOverlay,
} from "@chakra-ui/react";
import { secretAtom } from "../../components/user-modal/secret-id";
import { useAtomValue } from "jotai/utils";
import { AxiosError } from "axios";
import { useLoggedSession } from "../../lib/hooks/useLoggedSession";
import { useRouter } from "next/router";
import NextLink from "next/link";

const Title = ({ title }: { title: string }) => (
  <Text mb="40px" w="90%" fontSize="xl">
    {title}
  </Text>
);

const ReportInfo = ({ report }: { report: ReportType }) => (
  <Text fontWeight="hairline" pos="absolute" bottom="10%" fontSize="xs">
    send to{" "}
    <Text fontWeight="semibold" as="span">
      {report.staff}
    </Text>{" "}
    3 days ago
  </Text>
);

const Report = ({ report }: { report: ReportType }) => {
  return (
    <LinkBox
      w="full"
      p="10px"
      minH="110px"
      rounded="md"
      bg="white"
      border="1px solid #ADADAD"
      color="black"
      shadow="lg"
      key={report.id}
      pos="relative"
    >
      <NextLink href={`/reports/${report.id}`} passHref>
        <LinkOverlay>
          <Title title={report.title} />
          <ReportInfo report={report} />
        </LinkOverlay>
      </NextLink>
    </LinkBox>
  );
};

const EmptyReport = () => (
  <Box h="110px">
    <Title title="TypeError: Cannot read properties of undefined (reading 'map') ext..." />
    <Text fontWeight="hairline" pos="absolute" bottom="10%" fontSize="xs">
      send to staff 3 days ago
    </Text>
  </Box>
);

const Index = () => {
  const session = useLoggedSession();
  const secretId = useAtomValue(secretAtom);
  const router = useRouter();
  const user = session.data?.user as authUser;

  const intraReports = useQuery<ReportType[], AxiosError>(
    ["reports", user?.login],
    () => getReports(user?.login, false),
    { enabled: !!user },
  );

  const secretReports = useQuery<ReportType[], AxiosError>(
    ["reports", secretId],
    () => getReports(secretId, false),
    { enabled: !!secretId },
  );

  if (session.status === "loading") return null;

  if (intraReports.isError || secretReports.isError)
    router.push("/error", {
      query: {
        error: intraReports.isError
          ? intraReports.error.message
          : secretReports.error.message,
      },
    });

  return (
    <Container
      shadow={{ base: "none", lg: "lg" }}
      border={{ base: "none", lg: "2px solid #ADADAD" }}
      bg={{ base: "none", lg: "white" }}
      maxW="container.lg"
      pos="relative"
      p="30px"
      top="40px"
      rounded="lg"
    >
      <VStack>
        {intraReports.isLoading
          ? [...Array(5)].map((_, i) => (
              <Skeleton p="10px" w="full" key={i} shadow="lg" rounded="lg">
                <EmptyReport />
              </Skeleton>
            ))
          : intraReports.data.map((report) => <Report report={report} />)}
      </VStack>
    </Container>
  );
};

const getServerSideProps: GetServerSideProps = async ({ req, query }) => {
  const session = await getSession({ req });

  if (!session)
    return { redirect: { destination: "/login", permanent: false } };

  const user = session.user as authUser;
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(["reports", user.login], () =>
    getReports(user.login, false, req.headers as AxiosRequestHeaders),
  );

  const userId = query.userId;
  if (userId && !(userId instanceof Array))
    await queryClient.prefetchQuery(["reports", userId], () =>
      getReports(userId, true, req.headers as AxiosRequestHeaders),
    );

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};

export { Index as default, getServerSideProps };
