import {
  Box,
  Flex,
  VStack,
  Select,
  Switch,
  Text,
  Button,
  useBoolean,
  useBreakpointValue,
} from "@chakra-ui/react";
import { atom, useAtom } from "jotai";
import { useAtomValue, useUpdateAtom } from "jotai/utils";
import { useEffect, useRef } from "react";
import { stepAtom } from ".";
import { MotionBox } from "../motion-components";
import sleep from "../../lib/sleep";

const localStepAtom = atom(0);

const StaffSelect = () => {
  const ref = useRef<HTMLSelectElement>();
  const [localStep, setLocalStep] = useAtom(localStepAtom);
  useEffect(() => {
    if (localStep !== 1) return;
    const main = async () => {
      await sleep(1000);
      ref.current.focus();
      await sleep(300);
      ref.current.value = "staff1";
      await sleep(200);
      ref.current.blur();
      await sleep(500);
      setLocalStep(2);
    };
    main();
  }, [localStep, setLocalStep]);
  return (
    <Box w="full">
      <Flex w="full" justify="space-between" align="center">
        <Text fontSize={{ base: "14px", md: "md" }} as="label" w="fit-content">
          Send to:
        </Text>
        <Select
          ref={ref}
          type="select"
          as={Select}
          placeholder="Select staff"
          variant="filled"
          h={{ base: "35px", md: "40px" }}
          w={{ base: "90px", md: "135px" }}
          display="inline-block"
          width="fit-content"
          name="staff"
        >
          <option key="staff1" value="staff1">
            staff1
          </option>
          <option key="staff2" value="staff2">
            staff2
          </option>
        </Select>
      </Flex>
    </Box>
  );
};

const AnonymousSwitch = () => {
  const [isChecked, { on }] = useBoolean();
  const [localStep, setLocalStep] = useAtom(localStepAtom);
  const breakpoint = useBreakpointValue({ base: "base", md: "md" });

  useEffect(() => {
    if (localStep !== 2) return;
    const main = async () => {
      on();
      await sleep(500);
      setLocalStep(3);
    };
    main();
  }, [on, localStep, setLocalStep]);

  return (
    <Box w="full">
      <Flex w="full" justify="space-between" align="center">
        <Text fontSize={{ base: "14px", md: "md" }} as="label" w="fit-content">
          Anonymous ?
        </Text>
        <Switch
          readOnly
          defaultChecked
          isChecked={isChecked}
          type="Checkbox"
          colorScheme="customBlack"
          size={breakpoint === "base" ? "md" : "lg"}
          name="anonymous"
        />
      </Flex>
      {isChecked ? null : (
        <Text
          position="absolute"
          fontSize={{ base: "9px", md: "14px" }}
          color="yellow.600"
        >
          ⚠Your identity will be added
        </Text>
      )}
    </Box>
  );
};

const SubmitButton = () => {
  const [active, { on }] = useBoolean();
  const [localStep, setLocalStep] = useAtom(localStepAtom);
  const setGlobalStep = useUpdateAtom(stepAtom);
  useEffect(() => {
    if (localStep !== 3) return;
    const main = async () => {
      on();
      await sleep(500);
      setLocalStep(0);
      setGlobalStep(4);
    };
    main();
  }, [on, localStep, setLocalStep, setGlobalStep]);
  return (
    <Flex justify="flex-end" w="full">
      <Button
        fontSize={{ base: "13px", md: "md" }}
        h={{ base: "33px", md: "45px" }}
        w={{ base: "60px", md: "90px" }}
        isLoading={active}
        transform={active ? "scale(0.9)" : undefined}
        bgColor="black"
        color="white"
        type="submit"
      >
        Create
      </Button>
    </Flex>
  );
};

const SubmitControl = () => {
  const globalStep = useAtomValue(stepAtom);
  const setLocalStep = useUpdateAtom(localStepAtom);
  useEffect(() => {
    if (globalStep !== 3) return;
    setLocalStep(1);
  }, [globalStep, setLocalStep]);

  const variants = {
    open: {
      x: 0,
      opacity: 1,
      transition: { delay: 0.5, duration: 0.3 },
    },
    closed: (step) => ({
      x: step <= 3 ? 200 : 0,
      y: step === 5 ? 200 : 0,
      opacity: 0,
      transition: { duration: 0.3 },
    }),
  };
  return (
    <MotionBox
      initial={false}
      variants={variants}
      custom={globalStep}
      animate={globalStep >= 3 && globalStep < 5 ? "open" : "closed"}
      pos="absolute"
      w={{ base: "220px", md: "300px" }}
      h={{ base: "190px", md: "255px" }}
      py={{ base: "3px", md: "10px" }}
      border="3px solid #ABABAB"
      borderRadius="md"
      bg="white"
    >
      <VStack spacing={{ base: "7", md: "10" }} m={{ base: "3.5", md: "5" }}>
        <StaffSelect />
        <AnonymousSwitch />
        <SubmitButton />
      </VStack>
    </MotionBox>
  );
};

export { SubmitControl as default };
