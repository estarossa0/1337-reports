import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Highlight from "@tiptap/extension-highlight";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import { Editor, useEditor } from "@tiptap/react";
import React, { createContext } from "react";
import { atomWithStorage } from "jotai/utils";
import { useAtom } from "jotai";

const EditorContext = createContext<Editor>(null);
const editorContent = atomWithStorage("editorContent", null);

const EditorProvider: React.FC = ({ children }) => {
  const [content, setEditorContent] = useAtom(editorContent);

  const editor = useEditor({
    onUpdate: ({ editor }) => {
      setEditorContent(editor.getJSON());
    },
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

  return (
    <EditorContext.Provider value={editor}>{children}</EditorContext.Provider>
  );
};

export { EditorProvider as default, EditorContext, editorContent };
