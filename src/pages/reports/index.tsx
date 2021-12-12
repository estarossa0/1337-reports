import { AxiosRequestHeaders } from "axios";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import { dehydrate, QueryClient, useQuery } from "react-query";
import { getReports } from "../../lib/api-services";
import { authUser } from "../api/auth/[...nextauth]";
import { Report as ReportType } from "@prisma/client";
import { Box, Container, Text } from "@chakra-ui/react";
import { secretAtom } from "../../components/user-modal/secret-id";
import { useAtomValue } from "jotai/utils";
import { AxiosError } from "axios";
import { useLoggedSession } from "../../lib/hooks/useLoggedSession";
import { useRouter } from "next/router";

const Report = ({ report }: { report: ReportType }) => {
  return (
    <Box
      my="20px"
      p="10px"
      w="100%"
      rounded="md"
      bg="#53585c"
      border="1px solid #ADADAD"
      color="white"
      key={report.id}
    >
      <Text>{report.reporter}</Text>
      <Text>{report.title}</Text>
    </Box>
  );
};

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
    <Container pos="relative" zIndex="0" pt="70px">
      {intraReports.data.map((report) => (
        <Report report={report} />
      ))}
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
