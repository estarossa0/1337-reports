import { Content } from "@tiptap/react";
import { Formik } from "formik";
import { useContext } from "react";
import * as Yup from "yup";
import { EditorContext } from "./editor-provider";

export interface FormValues {
  title: string;
  anonymous: boolean;
  staff: string;
  description: Content;
}

const SubmitForm = ({ children, ...props }) => {
  const editor = useContext(EditorContext);
  const initialValues: FormValues = {
    title: "",
    anonymous: true,
    staff: "",
    description: {},
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
      onSubmit={(values, actions) => {
        actions.setFieldValue("description", editor ? editor.getJSON() : null);
        editor.commands.clearContent();
        console.log(editor.getJSON());
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
