import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import { getReport } from "../../lib/api-services";
import { authUser } from "../api/auth/[...nextauth]";
import { ReportWithComments } from "../../lib/prisma/client";
import { useLoggedSession } from "../../lib/hooks";
import { Box, Container } from "@chakra-ui/react";
import { useQuery } from "react-query";
import Title from "../../components/report/title";
import ReportDescription from "../../components/report/description";
import Comments from "../../components/report/comment";
import { validate as uuidValidate } from "uuid";

const Report = ({
  reportId,
  report,
}: {
  reportId: string;
  report: ReportWithComments;
}) => {
  const session = useLoggedSession();
  const { data, isLoading, isError } = useQuery<ReportWithComments>(
    ["report", reportId],
    () => getReport(reportId, report.reporter),
    { initialData: report },
  );
  if (session.status === "loading" || isLoading || isError) return null;

  return (
    <Container
      maxW={{ base: undefined, md: "container.xl" }}
      pos="relative"
      top="40px"
      rounded="lg"
      minH="90vh"
    >
      <Title report={data} />
      <Box h="2px" w="full" bg="#CCCCCC" />
      <ReportDescription report={data} />
      <Comments reportId={reportId} comments={data.comment} />
    </Container>
  );
};

const getServerSideProps: GetServerSideProps = async ({ req, query }) => {
  const session = await getSession({ req });

  if (!session)
    return { redirect: { destination: "/login", permanent: false } };
  const user = session.user as authUser;
  const reportId = query.reportId.toString();

  let report = await getReport(reportId, user.login, req.headers).catch(
    () => null,
  );

  if (!report && query.userId && uuidValidate(query.userId))
    report = await getReport(
      reportId,
      query.userId.toString(),
      req.headers,
    ).catch(() => null);

  return {
    notFound: Boolean(!report),
    props: {
      reportId: reportId,
      report: report,
    },
  };
};
export { Report as default, getServerSideProps };
