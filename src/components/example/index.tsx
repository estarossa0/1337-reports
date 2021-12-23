import { Center } from "@chakra-ui/react";
import { atom } from "jotai";
import SubmitBox from "./submit-box";
import SubmitControl from "./submit-control";
import Toast from "./toast";
import Report from "./report";

const stepAtom = atom(1);

const Example = () => {
  return (
    <Center
      w={{ base: "full", sm: "340px", md: "600px" }}
      h={{ base: "300px", md: "400px" }}
    >
      <SubmitBox />
      <SubmitControl />
      <Toast />
      <Report />
    </Center>
  );
};

export { Example as default, stepAtom };
