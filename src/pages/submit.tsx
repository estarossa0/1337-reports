import { Center, Stack } from "@chakra-ui/react";
import SubmitControl from "../components/submit/submit-control";
import EditorProvider from "../components/submit/editor-provider";
import SubmitForm from "../components/submit/submit-form";
import SubmitBox from "../components/submit/submit-box";

const Submit = () => {
  return (
    <Center top="40px" pos="relative">
      <EditorProvider>
        <SubmitForm>
          <Stack
            align={{ base: "center", lg: undefined }}
            spacing="4"
            direction={{ base: "column", lg: "row" }}
          >
            <SubmitBox />
            <SubmitControl />
          </Stack>
        </SubmitForm>
      </EditorProvider>
    </Center>
  );
};

export { Submit as default };
