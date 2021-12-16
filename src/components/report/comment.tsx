import { Box, Button, Center, Flex, Text } from "@chakra-ui/react";
import { Editor, EditorContent } from "@tiptap/react";
import { useEditorWithExtensions } from "../../lib/hooks";
import { Comment as CommentType } from "@prisma/client";
import { useMutation, useQueryClient } from "react-query";
import { createComment } from "../../lib/api-services";
import { ReportWithComments } from "../../lib/prisma/client";
import Moment from "react-moment";
import { useSession } from "next-auth/react";
import { authUser } from "../../pages/api/auth/[...nextauth]";

const CommentBox = ({
  reportId,
  editor,
}: {
  reportId: string;
  editor: Editor;
}) => {
  const queryClient = useQueryClient();
  const mutation = useMutation(createComment, {
    mutationKey: ["report", reportId],
    onSuccess: () => {
      editor.commands.clearContent();
    },
    onSettled: () => queryClient.invalidateQueries(["report", reportId]),
  });
  const report = queryClient.getQueryData<ReportWithComments>([
    "report",
    reportId,
  ]);
  const session = useSession();
  if (session.status !== "authenticated") return null;
  const user = session.data.user as authUser;

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
      <Center>
        <Box
          onClick={() => editor.commands.focus()}
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
          onClick={() => {
            mutation.mutate({
              reportId: reportId,
              body: editor.getJSON(),
              author:
                report.anonymous && !user.isStaff ? "anonymous" : user.login,
              byStaff: user.isStaff,
            });
          }}
          isLoading={mutation.isLoading}
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
    </Box>
  );
};

const CommentItemHeader = ({ comment }: { comment: CommentType }) => {
  const session = useSession();
  if (session.status !== "authenticated") return null;
  const user = session.data.user as authUser;

  return (
    <Box
      borderTopRadius="4px"
      h="40px"
      borderBottom="1px solid #d0d7de"
      bg={
        (comment.byStaff && user.isStaff) || (!comment.byStaff && !user.isStaff)
          ? "#dcf4ff"
          : "#f7f8fa"
      }
      color="white"
      w="full"
    >
      <Text size="md" color="#57606a" p="8px">
        <Text
          as="span"
          color="black"
          textTransform="capitalize"
          fontWeight="bold"
        >
          {comment.author}
        </Text>
        <Text as="span">
          {" "}
          commented <Moment date={comment.createdAt} fromNow />
        </Text>
      </Text>
    </Box>
  );
};

const CommentItem = ({ comment }: { comment: CommentType }) => {
  const editor = useEditorWithExtensions(JSON.parse(comment.body), false);

  return (
    <>
      <Box
        w={{ base: "95%", lg: "90%" }}
        m="2"
        ml={{ base: "10px", lg: "40px" }}
        mt="0"
        border="1px solid #d0d7de"
        rounded="md"
        bg="white"
      >
        <CommentItemHeader comment={comment} />
        <Box>
          <EditorContent editor={editor} />
        </Box>
      </Box>
      <Box
        w="2px"
        h="20px"
        bg="#57606a"
        position="relative"
        bottom="5px"
        left={{ base: "23px", lg: "55px" }}
      />
    </>
  );
};

const CommentList = ({ comments }: { comments: CommentType[] }) => {
  return (
    <Box>
      {comments.map((comment) => (
        <CommentItem key={comment.id} comment={comment} />
      ))}
    </Box>
  );
};

const Comments = ({
  reportId,
  comments,
}: {
  reportId: string;
  comments: CommentType[];
}) => {
  const editor = useEditorWithExtensions("", true, "Leave a comment");

  if (!editor) return null;

  return (
    <>
      <CommentList comments={comments} />
      <CommentBox reportId={reportId} editor={editor} />
    </>
  );
};

export { Comments as default };
