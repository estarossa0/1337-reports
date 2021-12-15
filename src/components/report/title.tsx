import { Heading, Text } from "@chakra-ui/react";
import Moment from "react-moment";
import { Report as ReportType } from "@prisma/client";

const Title = ({ report }: { report: ReportType }) => (
  <>
    <Heading ml="10px" fontSize={{ base: "md", md: "lg", lg: "x-large" }}>
      {report.title}
      <Heading
        mb="10px"
        color="#57606a"
        fontSize={{ base: "xs", md: "sm", lg: "xl" }}
        as="span"
      >{` #${report.id}`}</Heading>
    </Heading>
    <Text
      ml="20px"
      mb="5px"
      color="#57606a"
      fontSize={{ base: "9px", md: "xs" }}
    >
      <Text fontWeight="semibold" as="span">
        {report.anonymous ? "anonymous" : report.reporter}
      </Text>{" "}
      created this report <Moment date={report.createdAt} fromNow />
    </Text>
  </>
);

export { Title as default };
