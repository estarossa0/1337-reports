import { AxiosRequestHeaders } from "axios";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import { dehydrate, QueryClient, useQuery } from "react-query";
import { getReports } from "../../lib/api-services";
import { authUser } from "../api/auth/[...nextauth]";
import { Report as ReportType } from "@prisma/client";
import { Container, VStack, Skeleton } from "@chakra-ui/react";
import { secretAtom } from "../../components/user-modal/secret-id";
import { useAtomValue } from "jotai/utils";
import { AxiosError } from "axios";
import { useLoggedSession } from "../../lib/hooks/useLoggedSession";
import { useRouter } from "next/router";
import Report, { EmptyReport } from "../../components/reports";

const useUserReports = () => {
  const session = useLoggedSession();
  const secretId = useAtomValue(secretAtom);
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
  return { intraReports, secretReports };
};

const Reports = () => {
  const router = useRouter();
  const { intraReports, secretReports } = useUserReports();

  if (intraReports.isError || secretReports.isError) {
    if (intraReports.error.code === "401" || secretReports.error.code === "401")
      router.replace("/login");
    router.push("/error", {
      query: {
        error: intraReports.isError
          ? intraReports.error.message
          : secretReports.error.message,
      },
    });
    return null;
  }

  if (intraReports.isLoading)
    return (
      <>
        {[...Array(5)].map((_, i) => (
          <Skeleton p="10px" w="full" key={i} shadow="lg" rounded="lg">
            <EmptyReport />
          </Skeleton>
        ))}
      </>
    );

  const ReportsArray: JSX.Element[] = [];

  if (intraReports.isSuccess)
    ReportsArray.push(
      ...intraReports.data.map((report) => (
        <Report key={report.id} report={report} />
      )),
    );

  if (secretReports.isSuccess)
    ReportsArray.push(
      ...secretReports.data.map((report) => (
        <Report key={report.id} report={report} />
      )),
    );

  return <>{ReportsArray}</>;
};

const Index = () => {
  const session = useLoggedSession();

  if (session.status === "loading") return null;

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
      minH="90vh"
    >
      <VStack>
        <Reports />
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
