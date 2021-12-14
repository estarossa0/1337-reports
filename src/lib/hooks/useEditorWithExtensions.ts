import Highlight from "@tiptap/extension-highlight";
import Placeholder from "@tiptap/extension-placeholder";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Content } from "@tiptap/core";

const useEditorWithExtensions = (content: Content, editable: boolean) =>
  useEditor({
    editable: editable,
    content: content,
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: "Description (optional)" }),
      Highlight,
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
    ],
  });

export { useEditorWithExtensions as default };
