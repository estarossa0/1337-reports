import {
  Box,
  Button,
  Center,
  useBoolean,
  Input,
  useClipboard,
} from "@chakra-ui/react";
import { useContext, useState } from "react";
import { atomWithStorage } from "jotai/utils";
import { useAtom } from "jotai";
import { v4 as uuidv4, validate as uuidValidate } from "uuid";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import ErrorBox from "../submit/submit-error";
import { UserContext } from ".";

const secretAtom = atomWithStorage("secretId", null);

const SecretIdNotfound = ({ setSecretId }) => {
  const [state, setState] = useState<"initial" | "options" | "input">(
    "initial",
  );
  const [isLoading, setIsLoading] = useBoolean();

  const buttonProps = {
    _hover: { color: "white", bgColor: "red" },
    h: "full",
    fontSize: "sm",
    color: "red",
  };

  if (state === "options") {
    return (
      <>
        <Button
          isLoading={isLoading}
          onClick={() => {
            setIsLoading.on();
            setSecretId(uuidv4());
          }}
          borderRadius="4px 0px 0px 4px"
          {...buttonProps}
        >
          Generate new
        </Button>
        <Button
          onClick={() => setState("input")}
          isDisabled={isLoading}
          borderRadius="0px 4px 4px 0px"
          {...buttonProps}
        >
          Add old one
        </Button>
      </>
    );
  } else if (state === "initial")
    return (
      <Button
        fontSize="xs"
        m="0"
        h="fit-content"
        onClick={() => setState("options")}
        textAlign="center"
        color="red"
        p="5px"
      >
        You don't have secret ID click to setup
      </Button>
    );
  else if (state === "input") {
    return (
      <Formik
        initialValues={{ input: "" }}
        validationSchema={Yup.object({
          input: Yup.string()
            .required("Insert your uuidv4 secret key")
            .test("uuid", "Not a valid uuidv4", (value) => uuidValidate(value)),
        })}
        onSubmit={({ input }) => setSecretId(input)}
      >
        <Form>
          <Field
            spellCheck="false"
            type=""
            name="input"
            as={Input}
            variant="unstyled"
            p="5px"
            autoComplete="off"
          />
          <Box pos="absolute">
            <ErrorBox name="input" />
          </Box>
        </Form>
      </Formik>
    );
  }
};

const SecretIdFound = () => {
  const [hovering, setHoving] = useBoolean();
  const [secretId, setSecretId] = useAtom(secretAtom);
  const { onCopy } = useClipboard(secretId);

  const buttonProps = {
    onMouseEnter: () => {
      setHoving.on();
    },
    onMouseLeave: () => {
      setHoving.off();
    },
    h: "full",
    fontSize: "sm",
  };

  if (hovering) {
    return (
      <>
        <Button
          px="32px"
          onClick={onCopy}
          color="yellow.400"
          _hover={{ color: "white", bgColor: "yellow.400" }}
          borderRadius="4px 0px 0px 4px"
          {...buttonProps}
        >
          Copy
        </Button>
        <Button
          px="32px"
          onClick={() => setSecretId(null)}
          color="red"
          _hover={{ color: "white", bgColor: "red" }}
          borderRadius="0px 4px 4px 0px"
          {...buttonProps}
        >
          Delete
        </Button>
      </>
    );
  }
  return (
    <Button
      onClick={setHoving.on}
      onMouseLeave={setHoving.off}
      onMouseEnter={setHoving.on}
      fontSize="xs"
      m="0"
      h="fit-content"
      textAlign="center"
      color="green"
      p="5px"
    >
      Secret set, click/hover for options
    </Button>
  );
};

const SecretId = () => {
  const [secretId, setSecretId] = useAtom(secretAtom);

  if (secretId === null) {
    return <SecretIdNotfound setSecretId={setSecretId} />;
  } else return <SecretIdFound />;
};
const SecretIdContainer = () => {
  const user = useContext(UserContext);
  const [secretId] = useAtom(secretAtom);

  if (!user) return null;

  return (
    <Center
      mt="5px"
      mb="12px"
      shadow="md"
      border="1px solid"
      borderColor={secretId ? "green" : "red"}
      rounded="6px"
      textAlign="center"
      fontSize="sm"
      width="full"
      height="31px"
    >
      <SecretId />
    </Center>
  );
};

export { SecretIdContainer as default };
