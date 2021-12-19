import { Box, Center, Input, VStack } from "@chakra-ui/react";
import { EditorContent } from "@tiptap/react";
import SubmitCommands from "./submit-commands";
import { useContext } from "react";
import { Field } from "formik";
import ErrorBox from "./submit-error";
import { EditorContext } from "./editor-provider";

const TitleBox = () => {
  return (
    <Box w="98%" m="2">
      <Field
        as={Input}
        _focus=""
        borderColor="#ABABAB"
        placeholder="Title"
        name="title"
      />
      <ErrorBox name="title" />
    </Box>
  );
};

const DescriptionBox = () => {
  const editor = useContext(EditorContext);

  return (
    <Box
      onClick={() => editor.commands.focus()}
      borderRadius="md"
      minH="400"
      w="98%"
      m="2"
      border="1px solid #ABABAB"
      className="EditorContainer"
    >
      {editor ? <EditorContent editor={editor} /> : <Box />}
    </Box>
  );
};

const SubmitBox = () => (
  <VStack w={{ base: "full", md: "620px", xl: "750px" }} spacing="0">
    <Center
      flexDirection="column"
      w="full"
      borderRadius="2px 2px 0px 0px"
      border="3px solid black"
      minH="450px"
      bg="white"
    >
      <TitleBox />
      <DescriptionBox />
    </Center>
    <SubmitCommands />
  </VStack>
);

export { SubmitBox as default };
