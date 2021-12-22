import { Icon, Text, Flex, Box } from "@chakra-ui/react";
import { MotionBox } from "../motion-components";
import { BsCheckCircleFill } from "react-icons/bs";
import { stepAtom } from ".";
import { useEffect } from "react";
import { useAnimation } from "framer-motion";
import { useAtom } from "jotai";

const Toast = () => {
  const [globalStep, setGloablStep] = useAtom(stepAtom);
  const controls = useAnimation();
  useEffect(() => {
    controls.start("closed");
    if (globalStep !== 4) return;
    const main = async () => {
      await controls.start("open");
      setGloablStep(5);
    };
    main();
  }, [globalStep, setGloablStep, controls]);

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
      variants={variants}
      initial="closed"
      animate={controls}
      p="2"
      mt="200px"
      pos="absolute"
      bg="green.500"
      w="220px"
      h="70px"
      rounded="md"
    >
      <Flex>
        <Icon
          as={BsCheckCircleFill}
          color="white"
          h="6"
          w="5"
          marginInlineEnd="3"
        />
        <Box>
          <Text as="span" color="white" fontWeight="Bold">
            Success
          </Text>
          <Text color="white">Report created.</Text>
        </Box>
      </Flex>
    </MotionBox>
  );
};

export { Toast as default };
