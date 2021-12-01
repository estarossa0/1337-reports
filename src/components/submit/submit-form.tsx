import { Content } from "@tiptap/react";
import { Formik } from "formik";
import { useContext } from "react";
import * as Yup from "yup";
import { EditorContext } from "./editor-provider";

export interface FormValues {
  title: string;
  anonymous: boolean;
  staff: string;
  description: Content | null;
}

const SubmitForm = ({ children, ...props }) => {
  const editor = useContext(EditorContext);
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
      onSubmit={(values) => {
        if (editor && editor.isEmpty === false)
          values.description = editor.getJSON();
      }}
      {...props}
    >
      {(formik) => {
        return <form onSubmit={formik.handleSubmit}>{children}</form>;
      }}
    </Formik>
  );
};

export { SubmitForm as default };
