import { Box, Heading, Text } from "@chakra-ui/react";
import { EditorContent } from "@tiptap/react";
import { Content } from "@tiptap/core";
import { useEditorWithExtensions } from "../../lib/hooks";
import Moment from "react-moment";
import { MotionBox } from "../motion-components";
import { stepAtom } from ".";
import { useAtomValue } from "jotai/utils";

const body: Content = {
  type: "doc",
  content: [
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "Students are being ",
        },
        {
          type: "text",
          marks: [
            {
              type: "bold",
            },
          ],
          text: "very loud",
        },
        {
          type: "text",
          text: " in the playground these last days,",
        },
      ],
    },
    {
      type: "bulletList",
      content: [
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Play music in the tv at max volume",
                },
              ],
            },
          ],
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Scream while they're playing",
                },
              ],
            },
          ],
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "we try to talk to them they always say",
        },
      ],
    },
    {
      type: "blockquote",
      content: [
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "This is playgrounds we can be as loud as we want",
            },
          ],
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "Can you ask them to ",
        },
        {
          type: "text",
          marks: [
            {
              type: "highlight",
            },
          ],
          text: "be quieter",
        },
        {
          type: "text",
          text: " OR make the meeting rooms door closable.",
        },
      ],
    },
    {
      type: "horizontalRule",
    },
    {
      type: "paragraph",
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "Thank you",
        },
      ],
    },
  ],
};

const Title = () => (
  <>
    <Heading ml="10px" fontSize={{ base: "sm", md: "lg", lg: "x-large" }}>
      Loud playgrounds
      <Heading
        mb="10px"
        color="#57606a"
        fontSize={{ base: "xs", md: "sm", lg: "xl" }}
        as="span"
      >
        {" "}
        #1
      </Heading>
    </Heading>
    <Text
      ml="20px"
      mb="5px"
      color="#57606a"
      fontSize={{ base: "9px", md: "xs" }}
    >
      <Text fontWeight="semibold" as="span">
        anonymous
      </Text>{" "}
      created this report <Moment date={Date.now()} fromNow /> ?? 0 comments
    </Text>
  </>
);

const Description = () => {
  const editor = useEditorWithExtensions(body, false);

  return (
    <Box
      m="2"
      ml={{ base: "10px", md: "40px" }}
      bg="white"
      border="1px solid black"
      borderRadius="md"
      minH="80px"
      w="100%"
      fontSize={{ base: "11px", md: "sm" }}
    >
      <Box
        borderTopRadius="4px"
        h={{ base: "25px", md: "40px" }}
        bg="black"
        color="white"
        w="100%"
      >
        <Text
          fontSize={{ base: "12px", md: "sm" }}
          p={{ base: "4px", md: "8px" }}
        >
          Description:
        </Text>
      </Box>

      {editor ? <EditorContent editor={editor} /> : <Box />}
    </Box>
  );
};

const Report = () => {
  const globalStep = useAtomValue(stepAtom);

  const variants = {
    open: {
      y: 0,
      opacity: 1,
      transition: {
        delay: 0.5,
        duration: 0.3,
        y: { type: "spring", stiffness: 100 },
      },
    },
    closed: {
      y: 200,
      opacity: 0,
      transition: {
        duration: 0.3,
      },
    },
  };
  return (
    <MotionBox
      initial={false}
      variants={variants}
      animate={globalStep === 5 ? "open" : "closed"}
      w={{ base: "full", sm: "330px", md: "550px" }}
      pos="absolute"
      rounded="lg"
    >
      <Title />
      <Box h="2px" w="90%" bg="#CCCCCC" />
      <Description />{" "}
    </MotionBox>
  );
};

export { Report as default };
