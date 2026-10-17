import type { ReactNode } from "react";
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
    children: ReactNode;
    title: string;
    active: boolean;
    onClick: () => void;
}

function ToolbarButton({ children, title, active, onClick }: ToolbarButtonProps) {
    return (
        <button
            type="button"
            title={title}
            aria-label={title}
            aria-pressed={active}
            onClick={onClick}
            className={`inline-flex h-8 min-w-8 items-center justify-center rounded-md px-2 text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 ${
                active ? "bg-indigo-100 text-indigo-700" : "bg-transparent text-slate-700 hover:bg-slate-200"
            }`}
        >
            {children}
        </button>
    );
}

const svgProps = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    className: "h-4 w-4",
    "aria-hidden": true,
} as const;

const BulletIcon = () => (
    <svg {...svgProps}>
        <path d="M9 6h11M9 12h11M9 18h11" />
        <circle cx="4.5" cy="6" r="1" fill="currentColor" />
        <circle cx="4.5" cy="12" r="1" fill="currentColor" />
        <circle cx="4.5" cy="18" r="1" fill="currentColor" />
    </svg>
);
const OrderedIcon = () => (
    <svg {...svgProps}>
        <path d="M10 6h10M10 12h10M10 18h10M4 5l1-1v4M4 14h2l-2 3h2" />
    </svg>
);
const CodeIcon = () => (
    <svg {...svgProps}>
        <path d="M8 7l-5 5 5 5M16 7l5 5-5 5" />
    </svg>
);
const QuoteIcon = () => (
    <svg {...svgProps}>
        <path d="M4 6v6h5a4 4 0 01-4 4M14 6v6h5a4 4 0 01-4 4" />
    </svg>
);

const Divider = () => <span className="mx-1 h-5 w-px bg-slate-300" />;

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
        <div className="flex flex-wrap items-center gap-0.5 border-b border-slate-200 bg-slate-50 px-2 py-1.5 rounded-t-lg">
            <ToolbarButton title="Bold" active={state.bold} onClick={() => editor.chain().focus().toggleBold().run()}>
                <span className="font-bold">B</span>
            </ToolbarButton>
            <ToolbarButton title="Italic" active={state.italic} onClick={() => editor.chain().focus().toggleItalic().run()}>
                <span className="font-serif italic">I</span>
            </ToolbarButton>
            <ToolbarButton title="Strikethrough" active={state.strike} onClick={() => editor.chain().focus().toggleStrike().run()}>
                <span className="line-through">S</span>
            </ToolbarButton>
            <Divider />
            <ToolbarButton title="Heading" active={state.h2} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
                <span className="font-semibold">H</span>
            </ToolbarButton>
            <ToolbarButton title="Bulleted list" active={state.bullet} onClick={() => editor.chain().focus().toggleBulletList().run()}>
                <BulletIcon />
            </ToolbarButton>
            <ToolbarButton title="Numbered list" active={state.ordered} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
                <OrderedIcon />
            </ToolbarButton>
            <Divider />
            <ToolbarButton title="Inline code" active={state.code} onClick={() => editor.chain().focus().toggleCode().run()}>
                <CodeIcon />
            </ToolbarButton>
            <ToolbarButton title="Quote" active={state.quote} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
                <QuoteIcon />
            </ToolbarButton>
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
