import NextLink from "next/link";
import { LinkBox, LinkOverlay, Box, Text, Icon, Flex } from "@chakra-ui/react";
import { Report as ReportType } from "@prisma/client";
import Moment from "react-moment";
import { useSession } from "next-auth/react";
import { authUser } from "../../pages/api/auth/[...nextauth]";
import { FiMessageSquare } from "react-icons/fi";

type ReportWithCount = ReportType & { _count: { comment: number } };

const EmptyReport = () => (
  <Box h="110px">
    <Title title="TypeError: Cannot read properties of undefined (reading 'map') ext..." />
    <Text fontWeight="hairline" pos="absolute" bottom="10%" fontSize="xs">
      send to staff 3 days ago
    </Text>
  </Box>
);

const Title = ({ title }: { title: string }) => (
  <Text color="black" mb="40px" w="90%" fontSize="xl">
    {title}
  </Text>
);

const ReportInfo = ({ report }: { report: ReportType }) => {
  const session = useSession();

  if (session.status !== "authenticated") return null;
  const user = session.data.user as authUser;

  if (user.isStaff)
    return (
      <Text color="#57606a" pos="absolute" bottom="10%" fontSize="xs">
        sent from{" "}
        <Text fontWeight="semibold" as="span">
          {report.anonymous ? "anonymous" : report.reporter}
        </Text>{" "}
        <Moment date={report.createdAt} fromNow />
      </Text>
    );

  return (
    <Text color="#57606a" pos="absolute" bottom="10%" fontSize="xs">
      sent to{" "}
      <Text fontWeight="semibold" as="span">
        {report.staff}
      </Text>{" "}
      <Moment date={report.createdAt} fromNow />, as{" "}
      <Text fontWeight="semibold" as="span">
        {report.anonymous ? "anonymous" : report.reporter}
      </Text>
    </Text>
  );
};

const CommentCount = ({ report }: { report: ReportWithCount }) => {
  const {
    _count: { comment: count },
  } = report;

  return (
    <Flex justify="flex-end" w="95%" pos="absolute">
      <Box>
        <Icon as={FiMessageSquare} />
        <Text fontSize="sm" ml="1" as="span">
          {count}
        </Text>
      </Box>
    </Flex>
  );
};

const Report = ({ report }: { report: ReportType }) => {
  return (
    <LinkBox
      _hover={{ transform: "scale(1.05)" }}
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
      <NextLink
        href={`/reports/${report.id}?userId=${report.reporter}`}
        passHref
      >
        <LinkOverlay>
          <CommentCount report={report as ReportWithCount} />
          <Title title={report.title} />
          <ReportInfo report={report} />
        </LinkOverlay>
      </NextLink>
    </LinkBox>
  );
};

export { Report as default, EmptyReport };
