import { Text } from "@chakra-ui/react";
import { ErrorMessage } from "formik";

const ErrorText = ({ children }) => (
  <Text fontSize="12px" color="red" m="0">
    {children}
  </Text>
);

const ErrorBox = ({ name }) => (
  <ErrorMessage name={name} component={ErrorText} />
);

export { ErrorBox as default };
