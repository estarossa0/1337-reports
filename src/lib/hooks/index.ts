import Highlight from "@tiptap/extension-highlight";
import Placeholder from "@tiptap/extension-placeholder";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Content } from "@tiptap/core";
import { useSession } from "next-auth/react";
import router from "next/router";

const useEditorWithExtensions = (
  content: Content,
  editable: boolean,
  placeHolder?: string,
) =>
  useEditor({
    editable: editable,
    content: content,
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: placeHolder || "Description (optional)",
      }),
      Highlight,
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
    ],
  });

const useLoggedSession = () => {
  const session = useSession();

  if (session.status === "unauthenticated") router.push("/login");
  return session;
};

export { useEditorWithExtensions, useLoggedSession };
