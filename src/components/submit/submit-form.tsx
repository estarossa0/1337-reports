import { Content } from "@tiptap/react";
import { Formik } from "formik";
import { useContext } from "react";
import * as Yup from "yup";
import { EditorContext } from "./editor-provider";
import { createReport } from "../../lib/api-services";
import { editorContent } from "./editor-provider";
import { useAtom } from "jotai";
import { useMutation } from "react-query";
import { useToast } from "@chakra-ui/react";
import { AxiosError, AxiosResponse } from "axios";
import { useRouter } from "next/router";

export interface FormValues {
  title: string;
  anonymous: boolean;
  staff: string;
  description: Content | null;
}
interface responseData {
  reportId: number;
}
const useCreateReportMutation = () => {
  const [, setContent] = useAtom(editorContent);
  const toast = useToast({
    position: "bottom",
    duration: 9000,
    isClosable: true,
  });

  const router = useRouter();
  let redirectPage: string;

  const mutationSuccessHandler = (response: AxiosResponse<responseData>) => {
    toast({
      status: "success",
      description: "Redirecting you the report page",
      title: "Created",
    });
    setContent({});
    router.push(`/reports/${response.data.reportId}`);
  };

  const mutationErrorHandler = (error: AxiosError) => {
    if (error.response) {
      if (error.response.status === 401) redirectPage = "/login";
      if (error.response.status === 422 || error.response.status === 500)
        redirectPage = `/error?error=${error.response.data.errorMessage}`;
    }
    toast({
      status: "error",
      description: error.response.data.errorMessage,
      title: "Failed",
    });
    router.push(redirectPage);
  };

  const mutation = useMutation(createReport, {
    onSuccess: mutationSuccessHandler,
    onError: mutationErrorHandler,
  });
  return mutation;
};

const SubmitForm = ({ children, ...props }) => {
  const editor = useContext(EditorContext);
  const createReportMutation = useCreateReportMutation();

  const handleSubmit = (values: FormValues) => {
    if (editor && editor.isEmpty === false)
      values.description = editor.getJSON();
    createReportMutation.mutate(values);
  };

  const initialValues: FormValues = {
    title: "",
    anonymous: true,
    staff: "",
    description: null,
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={Yup.object({
        title: Yup.string()
          .max(70, "Must be 70 characters max")
          .min(5, "Must be 5 characters min")
          .required("Required"),
        staff: Yup.string().required("Required"),
      })}
      onSubmit={handleSubmit}
      {...props}
    >
      {(formik) => {
        return <form onSubmit={formik.handleSubmit}>{children}</form>;
      }}
    </Formik>
  );
};

export { SubmitForm as default };
