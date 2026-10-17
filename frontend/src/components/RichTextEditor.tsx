import { useEditor, EditorContent, useEditorState } from "@tiptap/react";
import type { Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Placeholder } from "@tiptap/extensions";

interface RichTextEditorProps {
    value: string;
    onChange: (html: string) => void;
    placeholder?: string;
}

interface ToolbarButtonProps {
    label: string;
    title: string;
    active: boolean;
    onClick: () => void;
}

function ToolbarButton({ label, title, active, onClick }: ToolbarButtonProps) {
    return (
        <button
            type="button"
            title={title}
            aria-label={title}
            aria-pressed={active}
            onClick={onClick}
            className={`h-8 min-w-8 px-2 rounded-md text-sm transition-colors ${
                active ? "bg-indigo-100 text-indigo-700" : "text-slate-600 hover:bg-slate-100"
            }`}
        >
            {label}
        </button>
    );
}

function Toolbar({ editor }: { editor: Editor }) {
    const state = useEditorState({
        editor,
        selector: ({ editor: e }) => ({
            bold: e.isActive("bold"),
            italic: e.isActive("italic"),
            strike: e.isActive("strike"),
            h2: e.isActive("heading", { level: 2 }),
            bullet: e.isActive("bulletList"),
            ordered: e.isActive("orderedList"),
            code: e.isActive("code"),
            quote: e.isActive("blockquote"),
        }),
    });

    return (
        <div className="flex flex-wrap items-center gap-1 border-b border-slate-200 bg-slate-50 px-2 py-1.5">
            <ToolbarButton label="B" title="Bold" active={state.bold} onClick={() => editor.chain().focus().toggleBold().run()} />
            <ToolbarButton label="I" title="Italic" active={state.italic} onClick={() => editor.chain().focus().toggleItalic().run()} />
            <ToolbarButton label="S" title="Strikethrough" active={state.strike} onClick={() => editor.chain().focus().toggleStrike().run()} />
            <span className="mx-1 h-5 w-px bg-slate-200" />
            <ToolbarButton label="H" title="Heading" active={state.h2} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} />
            <ToolbarButton label="• List" title="Bulleted list" active={state.bullet} onClick={() => editor.chain().focus().toggleBulletList().run()} />
            <ToolbarButton label="1. List" title="Numbered list" active={state.ordered} onClick={() => editor.chain().focus().toggleOrderedList().run()} />
            <span className="mx-1 h-5 w-px bg-slate-200" />
            <ToolbarButton label="&lt;/&gt;" title="Inline code" active={state.code} onClick={() => editor.chain().focus().toggleCode().run()} />
            <ToolbarButton label="&ldquo;" title="Quote" active={state.quote} onClick={() => editor.chain().focus().toggleBlockquote().run()} />
        </div>
    );
}

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
    const editor = useEditor({
        extensions: [StarterKit, Placeholder.configure({ placeholder: placeholder ?? "" })],
        content: value,
        editorProps: {
            attributes: {
                class: "rich-text min-h-32 max-h-64 overflow-y-auto px-3 py-2 text-slate-800 focus:outline-none",
            },
        },
        onUpdate: ({ editor: e }) => onChange(e.isEmpty ? "" : e.getHTML()),
    });

    if (!editor) return null;

    return (
        <div className="rounded-lg border border-slate-300 bg-white focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-200">
            <Toolbar editor={editor} />
            <EditorContent editor={editor} />
        </div>
    );
}
