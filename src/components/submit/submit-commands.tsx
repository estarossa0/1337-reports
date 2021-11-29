import { VscBold, VscCode } from "react-icons/vsc";
import {
  RiItalic,
  RiStrikethrough,
  RiDoubleQuotesL,
  RiFormatClear,
  RiArrowGoBackLine,
  RiArrowGoForwardLine,
} from "react-icons/ri";
import { BiCode, BiHighlight } from "react-icons/bi";
import {
  MdFormatListBulleted,
  MdFormatListNumbered,
  MdOutlineCheckBox,
  MdOutlineHorizontalRule,
  MdOutlineWrapText,
} from "react-icons/md";
import {
  Box,
  Button,
  Divider,
  HStack,
  IconButtonProps,
  useBreakpointValue,
} from "@chakra-ui/react";
import { EditorContext } from "./editor-provider";
import { useContext } from "react";

const CommandButton = ({ as: Icon, onClick, title }: IconButtonProps) => {
  const size = useBreakpointValue({ base: 16, xl: 24 });

  return (
    <Button
      _hover={{ color: "white", bg: "black" }}
      size=""
      aria-label={title}
      title={title}
      onClick={onClick}
      my="1"
    >
      <Icon size={size} />
    </Button>
  );
};

const SubmitCommands = () => {
  const editor = useContext(EditorContext);

  return (
    <Box
      bg="white"
      w="full"
      h="fit-content"
      border="3px solid black"
      borderTop="0"
      borderRadius="0px 0px 10px 10px"
    >
      <HStack wrap="wrap" spacing={5} h="70%" m="1">
        <CommandButton
          aria-label="Bold"
          title="Bold"
          as={VscBold}
          onClick={() => editor.chain().focus().toggleBold().run()}
        />
        <CommandButton
          aria-label="Italic"
          title="Italic"
          as={RiItalic}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        />
        <CommandButton
          aria-label="Strike"
          title="Strike"
          as={RiStrikethrough}
          onClick={() => editor.chain().focus().toggleStrike().run()}
        />
        <CommandButton
          aria-label="Code"
          title="Code"
          as={BiCode}
          onClick={() => editor.chain().focus().toggleCode().run()}
        />
        <CommandButton
          aria-label="Highlight"
          title="Highlight"
          as={BiHighlight}
          onClick={() => editor.chain().focus().toggleHighlight().run()}
        />
        <Divider orientation="vertical" />
        <CommandButton
          aria-label="Bullet list"
          title="Bullet list"
          as={MdFormatListBulleted}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        />
        <CommandButton
          aria-label="Ordered list"
          title="Ordered list"
          as={MdFormatListNumbered}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        />
        <CommandButton
          aria-label="Task list"
          title="Task list"
          as={MdOutlineCheckBox}
          onClick={() => editor.chain().focus().toggleTaskList().run()}
        />
        <CommandButton
          aria-label="Block code"
          title="Block code"
          as={VscCode}
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        />
        <Divider orientation="vertical" />
        <CommandButton
          aria-label="Block quote"
          title="Block quote"
          as={RiDoubleQuotesL}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        />
        <CommandButton
          aria-label="Divider"
          title="Divider"
          as={MdOutlineHorizontalRule}
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
        />
        <Divider orientation="vertical" />
        <CommandButton
          aria-label="Hard break"
          title="Hard break"
          as={MdOutlineWrapText}
          onClick={() => editor.chain().focus().setHardBreak().run()}
        />
        <CommandButton
          aria-label="Clear format"
          title="Clear format"
          as={RiFormatClear}
          onClick={() => editor.chain().focus().unsetAllMarks().run()}
        />
        <Divider orientation="vertical" />
        <CommandButton
          aria-label="Undo"
          title="Undo"
          as={RiArrowGoBackLine}
          onClick={() => editor.chain().focus().undo().run()}
        />
        <CommandButton
          aria-label="Redo"
          title="Redo"
          as={RiArrowGoForwardLine}
          onClick={() => editor.chain().focus().redo().run()}
        />
      </HStack>
    </Box>
  );
};

export { SubmitCommands as default };
