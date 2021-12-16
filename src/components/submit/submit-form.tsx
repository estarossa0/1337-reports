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
import router from "next/router";
import { secretAtom } from "../user-modal/secret-id";
import { validate as uuidValidate } from "uuid";

export interface FormValues {
  title: string;
  anonymous: boolean;
  staff: string;
  description: Content | null;
  reporter: string | null;
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
  const [secretId] = useAtom(secretAtom);

  let redirectPage: string;

  const mutationSuccessHandler = (
    response: AxiosResponse<responseData>,
    report: FormValues,
  ) => {
    toast({
      status: "success",
      description: "Redirecting you the report page",
      title: "Created",
    });
    setContent({});
    router.push(
      `/reports/${response.data.reportId}/${
        report.anonymous ? `?userId=${secretId}` : ""
      }`,
    );
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
  const [secretId] = useAtom(secretAtom);

  const handleSubmit = (values: FormValues) => {
    if (editor && editor.isEmpty === false)
      values.description = editor.getJSON();
    if (values.anonymous) values.reporter = secretId;
    createReportMutation.mutate(values);
  };

  const initialValues: FormValues = {
    title: "",
    anonymous: true,
    staff: "",
    description: null,
    reporter: "",
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
        anonymous: Yup.boolean()
          .test(
            "uuid",
            "Your secret id is not set, use icon in corner to set",
            (anonymous) => {
              if (!anonymous) return true;
              if (!secretId) return false;
              return true;
            },
          )
          .test(
            "uuid valide",
            "Your secret id is not valid, update it or generate new",
            (anounymous) => {
              if (!anounymous) return true;
              return uuidValidate(secretId);
            },
          ),
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
