import NextLink from "next/link";
import { LinkBox, LinkOverlay, Box, Text } from "@chakra-ui/react";
import { Report as ReportType } from "@prisma/client";
import Moment from "react-moment";

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

const ReportInfo = ({ report }: { report: ReportType }) => (
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
          <Title title={report.title} />
          <ReportInfo report={report} />
        </LinkOverlay>
      </NextLink>
    </LinkBox>
  );
};

export { Report as default, EmptyReport };
