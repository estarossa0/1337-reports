import { AxiosRequestHeaders } from "axios";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import { getReport } from "../../lib/api-services";
import { authUser } from "../api/auth/[...nextauth]";
import { Report as ReportType } from "@prisma/client";
import { useLoggedSession, useEditorWithExtensions } from "../../lib/hooks";
import {
  Box,
  Button,
  Center,
  Container,
  Flex,
  Heading,
  Text,
} from "@chakra-ui/react";
import Moment from "react-moment";
import { Editor, EditorContent } from "@tiptap/react";

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

const ReportDescription = ({ report }: { report: ReportType }) => {
  const editor = useEditorWithExtensions(JSON.parse(report.description), false);

  return (
    <>
      <Box
        m="2"
        ml={{ base: "10px", lg: "40px" }}
        bg="white"
        border="1px solid black"
        borderRadius="md"
        minH="80px"
        w={{ base: "95%", lg: "90%" }}
      >
        <Box borderTopRadius="4px" h="40px" bg="black" color="white" w="full">
          <Text p="8px">Description:</Text>
        </Box>
        {report.withDescription ? (
          <EditorContent editor={editor} />
        ) : (
          <Text color="#57606a" p="3" fontSize="sm" fontStyle="italic">
            No description provided.
          </Text>
        )}
      </Box>
      <Box
        w="2px"
        h="40px"
        bg="#57606a"
        position="relative"
        bottom="5px"
        left={{ base: "23px", lg: "55px" }}
      />
    </>
  );
};

const CommentBox = ({ editor }: { editor: Editor }) => (
  <>
    <Center>
      <Box
        p="0.4"
        shadow="sm"
        border={editor.isFocused ? "1px solid #0969da" : "1px solid #d0d7de"}
        boxShadow={
          editor.isFocused
            ? "rgba(9, 105, 218, 0.3) 0px 0px 0px 3px"
            : undefined
        }
        minH="100px"
        borderRadius="md"
        bg={editor.isFocused ? "white" : "#f6f8fa"}
        m="3"
        w="95%"
      >
        {editor ? <EditorContent editor={editor} /> : <Box />}
      </Box>
    </Center>
    <Flex w="95%" justify="flex-end">
      <Button
        h={{ base: "30px", md: "40px" }}
        w={{ base: "80px", md: "100px" }}
        fontSize={{ base: "sm", md: "md" }}
        _hover={{}}
        isDisabled={editor.isEmpty}
        m={{ base: "2", md: "3" }}
        bg="black"
        color="white"
        pos="relative"
      >
        Comment
      </Button>
    </Flex>
  </>
);
const Comment = () => {
  const editor = useEditorWithExtensions("", true, "Leave a comment");

  if (!editor) return null;

  return (
    <Box
      bg="white"
      m="2"
      ml={{ base: "10px", lg: "40px" }}
      border="1px solid #d0d7de"
      borderRadius="md"
      minH="120px"
      w={{ base: "95%", lg: "90%" }}
    >
      <CommentBox editor={editor} />
    </Box>
  );
};

const Report = ({ report }: { reportId: string; report: ReportType }) => {
  const session = useLoggedSession();

  if (session.status === "loading") return null;

  return (
    <Container
      maxW={{ base: undefined, md: "container.xl" }}
      pos="relative"
      top="40px"
      rounded="lg"
      minH="90vh"
    >
      <Title report={report} />
      <Box h="2px" w="full" bg="#CCCCCC" />
      <ReportDescription report={report} />
      <Comment />
    </Container>
  );
};

const getServerSideProps: GetServerSideProps = async ({ req, query }) => {
  const session = await getSession({ req });

  if (!session)
    return { redirect: { destination: "/login", permanent: false } };
  const user = session.user as authUser;
  const reportId = query.reportId.toString();

  let report = await getReport(
    reportId,
    user.login,
    req.headers as AxiosRequestHeaders,
  ).catch(() => null);

  if (!report && query.userId)
    report = await getReport(
      reportId,
      query.userId.toString(),
      req.headers as AxiosRequestHeaders,
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
