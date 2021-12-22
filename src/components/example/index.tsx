import { Center } from "@chakra-ui/react";
import { atom } from "jotai";
import SubmitBox from "./submit-box";
import SubmitControl from "./submit-control";
import Toast from "./toast";
import Report from "./report";

const stepAtom = atom(1);

const Example = () => {
  return (
    <Center w="600px" h="400px">
      <SubmitBox />
      <SubmitControl />
      <Toast />
      <Report />
    </Center>
  );
};

export { Example as default, stepAtom };
