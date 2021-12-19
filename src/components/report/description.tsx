import { Box, Text } from "@chakra-ui/react";
import { EditorContent } from "@tiptap/react";
import { useEditorWithExtensions } from "../../lib/hooks";
import { Report as ReportType } from "@prisma/client";
import { decode } from "@msgpack/msgpack";

const ReportDescription = ({ report }: { report: ReportType }) => {
  const description = report.withDescription
    ? decode(Buffer.from(report.description, "base64"))
    : null;
  const editor = useEditorWithExtensions(description, false);

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

export { ReportDescription as default };
