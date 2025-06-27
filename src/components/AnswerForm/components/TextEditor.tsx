"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import { Button } from "@/components/ui/button";
import { useCallback, useEffect } from "react";
import { cn } from "@/lib/utils";

const TextEditor = ({
  id,
  name,
  value,
  className,
  onChange,
  onBlur,
  ...props
}: {
  id: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  className?: string;
  [key: string]: unknown;
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class: cn(
          "prose text-sm border rounded-md px-3 py-2 bg-input",
          className
        ),
        id: id,
        name: name,
        ...props,
      },
    },
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  const setLink = useCallback(() => {
    if (!editor) return;
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL", previousUrl);

    // cancelled
    if (url === null) {
      return;
    }

    // empty
    if (url === "") {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .unsetLink()
        .run();

      return;
    }

    // update link
    try {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: url })
        .run();
    } catch (e: any) {
      alert(e.message);
    }
  }, [editor]);

  // If the form value changes externally, update the editor
  useEffect(() => {
    if (editor && editor.getHTML() !== value) {
      editor.commands.setContent(value || "");
    }
  }, [value]);

  if (!editor) {
    return null;
  }

  return (
    <>
      <EditorContent editor={editor} />
      <div className="border w-full flex gap-1 rounded-md p-1 mb-1">
        <Button
          type="button"
          variant="outline"
          onClick={setLink}
          className={
            editor.isActive("link") ? "is-active" : ""
          }
        >
          Link toevoegen
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() =>
            editor.chain().focus().unsetLink().run()
          }
          disabled={!editor.isActive("link")}
        >
          Link verwijderen
        </Button>
      </div>
    </>
  );
};

export default TextEditor;
