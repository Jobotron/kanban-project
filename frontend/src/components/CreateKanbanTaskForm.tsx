import { useEffect, useState } from "react";
import RichTextEditor from "./RichTextEditor.tsx";

interface CreateKanbanTaskFormProps {
    onCreate: (title: string, status: string, description: string) => Promise<void>;
}

export default function CreateKanbanTaskForm({ onCreate }: CreateKanbanTaskFormProps) {
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState("");
    const [status, setStatus] = useState("todo");
    const [description, setDescription] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const close = () => setOpen(false);

    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await onCreate(title, status, description);
            setTitle("");
            setStatus("todo");
            setDescription("");
            close();
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2"
            >
                <span aria-hidden>+</span> Add task
            </button>
            {open && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm"
                    onMouseDown={(e) => e.target === e.currentTarget && close()}
                >
                    <div role="dialog" aria-modal="true" aria-labelledby="new-task-title" className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl">
                        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
                            <h2 id="new-task-title" className="text-lg font-semibold text-slate-900">New task</h2>
                            <button onClick={close} aria-label="Close" className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600">&times;</button>
                        </div>
                        <form className="flex flex-col gap-5 px-6 py-5" onSubmit={handleSubmit}>
                            <label className="flex flex-col gap-1.5 text-sm font-medium text-slate-700">
                                Title
                                <input
                                    type="text"
                                    autoFocus
                                    placeholder="What needs to be done?"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                    className="rounded-lg border border-slate-300 px-3 py-2 font-normal text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                                />
                            </label>
                            <div className="flex flex-col gap-1.5 text-sm font-medium text-slate-700">
                                Description
                                <RichTextEditor value={description} onChange={setDescription} placeholder="Add details, notes, or a checklist…" />
                            </div>
                            <label className="flex flex-col gap-1.5 text-sm font-medium text-slate-700 sm:w-1/2">
                                Status
                                <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    className="rounded-lg border border-slate-300 bg-white px-3 py-2 font-normal text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                                >
                                    <option value="todo">To Do</option>
                                    <option value="in-progress">In Progress</option>
                                    <option value="done">Done</option>
                                </select>
                            </label>
                            <div className="flex justify-end gap-3 border-t border-slate-200 pt-4">
                                <button type="button" onClick={close} className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100">Cancel</button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 disabled:opacity-60"
                                >
                                    {submitting ? "Creating…" : "Create task"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
