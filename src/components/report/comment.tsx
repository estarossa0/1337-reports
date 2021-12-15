import { Box, Button, Center, Flex } from "@chakra-ui/react";
import { Editor, EditorContent } from "@tiptap/react";
import { useEditorWithExtensions } from "../../lib/hooks";
import { Comment as CommentType } from "@prisma/client";
import { useMutation, useQueryClient } from "react-query";
import { createComment } from "../../lib/api-services";

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
            mutation.mutate({ reportId: reportId, body: editor.getJSON() });
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
      <CommentBox reportId={reportId} editor={editor} />
    </>
  );
};

export { Comments as default };
