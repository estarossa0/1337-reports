import { useEditorWithExtensions } from "../lib/hooks";
import { EditorContent } from "@tiptap/react";
import { Center, Input, Box, useBoolean } from "@chakra-ui/react";
import { useEffect, useRef } from "react";
import { atom } from "jotai";
import { useUpdateAtom } from "jotai/utils";

const stepAtom = atom(0);

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const Title = () => {
  const ref = useRef<HTMLInputElement>(null);
  const setStep = useUpdateAtom(stepAtom);
  useEffect(() => {
    const main = async () => {
      await sleep(700);
      ref.current.focus();
      const text = "Loud playgrounds";
      for (let index = 0; index < text.length + 1; index++) {
        ref.current.value = text.substring(0, index);
        await sleep(100);
      }
      ref.current.blur();
      setStep(1);
    };
    main();
  }, [setStep]);
  return (
    <Box h="10%" w="98%" m="2">
      <Input
        isReadOnly
        _focus={{
          border: "1px solid #3182ce",
          boxShadow: "0 0 0 1px #3182ce !important",
        }}
        ref={ref}
        borderColor="#ABABAB"
        placeholder="Title"
        name="title"
      />
    </Box>
  );
};

const Description = () => {
  const editor = useEditorWithExtensions("", false);
  const [started, { on }] = useBoolean(false);
  useEffect(() => {
    if (!editor || started) return null;
    const main = async () => {
      const insertLine = async (line: string) => {
        for (let index = 0; index < line.length + 1; index++) {
          editor.commands.insertContent(line[index]);
          await sleep(20);
        }
      };
      on();
      const lines = [
        "Students are being very loud in the playground these last days,",
        "Play music in the tv at max volume",
        "Scream while they're playing",
        "we try to talk to them they always say",
        "This is playgrounds we can be as loud as we want",
        "Can you ask them to be quieter OR make the meeting rooms door closable.",
        "Thank you",
      ];

      await insertLine(lines[0]);
      editor.commands.enter();
      editor.commands.toggleBulletList();
      await insertLine(lines[1]);
      editor.commands.enter();
      await insertLine(lines[2]);
      editor.commands.enter();
      editor.commands.toggleBulletList();
      await insertLine(lines[3]);
      editor.commands.enter();
      editor.commands.toggleBlockquote();
      await insertLine(lines[4]);
      editor.commands.enter();
      editor.commands.toggleBlockquote();
      await insertLine(lines[5]);
      editor.commands.setHorizontalRule();
      editor.commands.enter();
      await insertLine(lines[6]);
      await sleep(200);
      editor.commands.setTextSelection({ from: 20, to: 29 });
      editor.commands.setMark("bold");
      await sleep(500);
      editor.commands.setTextSelection({ from: 250, to: 260 });
      editor.commands.setMark("highlight");
    };
    main();
  }, [editor, on, started]);
  if (!editor) return null;

  return (
    <Box
      onClick={() => editor.commands.focus()}
      borderRadius="md"
      h="80%"
      w="98%"
      m="2"
      border="1px solid #ABABAB"
      className="EditorContainer"
      fontSize="15px"
    >
      {editor ? <EditorContent editor={editor} /> : <Box />}
    </Box>
  );
};

const Example = () => {
  return (
    <Center
      flexDirection="column"
      w="40%"
      rounded="md"
      border="3px solid black"
      h="300px"
      bg="white"
    >
      <Title />
      <Description />
    </Center>
  );
};

export { Example as default };
