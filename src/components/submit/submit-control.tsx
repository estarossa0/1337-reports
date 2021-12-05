import {
  Box,
  Flex,
  VStack,
  Select,
  Switch,
  Text,
  Button,
} from "@chakra-ui/react";
import { Field, useFormikContext } from "formik";
import ErrorBox from "./submit-error";
import { FormValues } from "./submit-form";

const StaffSelect = () => {
  return (
    <Box w="full">
      <Flex w="full" justify="space-between" align="center">
        <Text as="label" w="fit-content">
          Send to:
        </Text>
        <Field
          type="select"
          as={Select}
          placeholder="Select staff"
          variant="filled"
          size="md"
          display="inline-block"
          width="fit-content"
          name="staff"
        >
          <option value="staff">staff</option>
        </Field>
      </Flex>
      <ErrorBox name="staff" />
    </Box>
  );
};

const AnonymousSwitch = () => {
  const formik = useFormikContext<FormValues>();

  return (
    <Box w="full">
      <Flex w="full" justify="space-between" align="center">
        <Text as="label" w="fit-content">
          Anonymous ?
        </Text>
        <Field
          defaultChecked
          as={Switch}
          type="Checkbox"
          colorScheme="customBlack"
          size="lg"
          name="anonymous"
        />
      </Flex>
      {formik.values.anonymous ? null : (
        <Text position="absolute" fontSize="12px" color="yellow.600">
          ⚠Your identity will be added
        </Text>
      )}
    </Box>
  );
};

const SubmitButton = () => {
  const formik = useFormikContext<FormValues>();

  return (
    <Flex justify="flex-end" w="full">
      <Button
        _hover={{ transform: "scale(0.9)" }}
        bgColor="black"
        color="white"
        type="submit"
        isDisabled={formik.isSubmitting}
        isLoading={formik.isSubmitting}
      >
        Create
      </Button>
    </Flex>
  );
};
const SubmitControl = () => {
  return (
    <Box
      w="300px"
      h="fit-content"
      py="10px"
      border="3px solid #ABABAB"
      borderRadius="md"
      bg="white"
    >
      <VStack spacing="10" m="5">
        <StaffSelect />
        <AnonymousSwitch />
        <ErrorBox name="anonymous" />
        <SubmitButton />
      </VStack>
    </Box>
  );
};

export { SubmitControl as default };
