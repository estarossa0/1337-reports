import { Center } from "@chakra-ui/react";
import { atom } from "jotai";
import SubmitBox from "./submit-box";

const stepAtom = atom(1);

const Example = () => {
  return (
    <Center w="600px" h="400px">
      <SubmitBox />
    </Center>
  );
};

export { Example as default, stepAtom };
