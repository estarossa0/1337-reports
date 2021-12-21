import { useEditorWithExtensions } from "../../lib/hooks";
import { EditorContent } from "@tiptap/react";
import { Input, Box, useBoolean } from "@chakra-ui/react";
import { useEffect, useRef } from "react";
import { useAtom } from "jotai";
import { MotionCenter } from "../motion-components";
import { stepAtom } from ".";
import sleep from "../../lib/sleep";

const Title = () => {
  const ref = useRef<HTMLInputElement>(null);
  const [step, setStep] = useAtom(stepAtom);
  useEffect(() => {
    if (step !== 1) return null;
    const main = async () => {
      await sleep(400);
      ref.current.focus();
      const text = "Loud playgrounds";
      for (let index = 0; index < text.length + 1; index++) {
        ref.current.value = text.substring(0, index);
        await sleep(100);
      }
      ref.current.blur();
      setStep(2);
    };
    main();
  }, [step, setStep]);
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
  const [step, setStep] = useAtom(stepAtom);

  useEffect(() => {
    if (!editor || started || step !== 2) return null;
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
      await sleep(500);
      setStep(3);
    };
    main();
  }, [editor, on, started, step, setStep]);
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

const SubmitBox = () => {
  const [step] = useAtom(stepAtom);
  const variants = {
    open: {
      x: 0,
      opacity: 1,
    },
    closed: {
      x: -200,
      opacity: 0,
      transition: { duration: 0.3 },
    },
  };

  return (
    <MotionCenter
      variants={variants}
      animate={step < 3 ? "open" : "closed"}
      flexDirection="column"
      rounded="md"
      w="80%"
      border="3px solid black"
      h="80%"
      bg="white"
    >
      <Title />
      <Description />
    </MotionCenter>
  );
};

export { SubmitBox as default };
