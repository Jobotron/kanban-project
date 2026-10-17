import DOMPurify from "dompurify";
import Task from "../models/Task.ts";

interface KanbanComponentProps {
    tasks: Readonly<Task[]>;
    onMoveTask: (task: Task, newStatus: string) => void;
    onDeleteTask: (task: Task) => void;
}

interface Lane {
    status: string;
    label: string;
    accent: string;
    dot: string;
}

const LANES: Lane[] = [
    { status: "todo", label: "To Do", accent: "border-t-slate-400", dot: "bg-slate-400" },
    { status: "in-progress", label: "In Progress", accent: "border-t-amber-400", dot: "bg-amber-400" },
    { status: "done", label: "Done", accent: "border-t-emerald-500", dot: "bg-emerald-500" },
];

export default function KanbanComponent({ tasks, onMoveTask, onDeleteTask }: KanbanComponentProps) {
    const renderCard = (task: Task) => (
        <article key={task.id} className="group rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
            <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold leading-snug text-slate-900">{task.title}</h3>
                <button
                    onClick={() => onDeleteTask(task)}
                    aria-label={`Delete ${task.title}`}
                    className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-transparent text-slate-400 opacity-0 transition hover:bg-red-50 hover:text-red-600 focus:opacity-100 group-hover:opacity-100"
                >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="h-3.5 w-3.5" aria-hidden>
                        <path d="M6 6l12 12M18 6L6 18" />
                    </svg>
                </button>
            </div>
            {task.description && (
                <div
                    className="rich-text mt-2 text-sm text-slate-600"
                    dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(task.description) }}
                />
            )}
            <div className="mt-3 flex flex-wrap gap-1.5 border-t border-slate-100 pt-3">
                {LANES.filter((l) => l.status !== task.status).map((l) => (
                    <button
                        key={l.status}
                        onClick={() => onMoveTask(task, l.status)}
                        className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 px-2.5 py-0.5 text-xs text-slate-600 transition-colors hover:border-slate-300 hover:bg-slate-50"
                    >
                        <span className={`h-1.5 w-1.5 rounded-full ${l.dot}`} />
                        {l.label}
                    </button>
                ))}
            </div>
        </article>
    );

    return (
        <div className="grid grid-cols-1 gap-0 overflow-hidden rounded-xl border border-slate-300 bg-white shadow-sm md:grid-cols-3 md:divide-x md:divide-slate-300">
            {LANES.map((lane) => {
                const laneTasks = tasks.filter((t) => t.status === lane.status);
                return (
                    <section
                        key={lane.status}
                        aria-label={lane.label}
                        className={`flex min-h-[28rem] flex-col border-t-4 bg-slate-100/70 ${lane.accent} max-md:border-b max-md:border-slate-300`}
                    >
                        <header className="flex items-center justify-between border-b border-slate-300 bg-slate-100 px-4 py-3">
                            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-700">{lane.label}</h2>
                            <span className="rounded-full bg-white px-2 py-0.5 text-xs font-medium text-slate-600 ring-1 ring-slate-200">
                                {laneTasks.length}
                            </span>
                        </header>
                        <div className="flex flex-1 flex-col gap-3 p-3">
                            {laneTasks.map(renderCard)}
                            {laneTasks.length === 0 && (
                                <div className="flex flex-1 items-center justify-center rounded-lg border-2 border-dashed border-slate-300 p-6 text-sm text-slate-400">
                                    No tasks
                                </div>
                            )}
                        </div>
                    </section>
                );
            })}
        </div>
    );
}
