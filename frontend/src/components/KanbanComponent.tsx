import Task from "../models/Task.ts";

interface KanbanComponentProps {
    tasks: Readonly<Task[]>;
    onMoveTask: (task: Task, newStatus: string) => void;
    onDeleteTask: (task: Task) => void;
}

const COLUMNS = [
    { key: 'todo',        label: 'To Do',       accent: 'border-blue-500' },
    { key: 'in-progress', label: 'In Progress',  accent: 'border-yellow-500' },
    { key: 'done',        label: 'Done',         accent: 'border-green-500' },
] as const;

const MOVE_BUTTONS: { key: string; label: string; cls: string }[] = [
    { key: 'todo',        label: 'To Do',       cls: 'bg-blue-900 text-blue-300 hover:bg-blue-800' },
    { key: 'in-progress', label: 'In Progress', cls: 'bg-yellow-900 text-yellow-300 hover:bg-yellow-800' },
    { key: 'done',        label: 'Done',        cls: 'bg-green-900 text-green-300 hover:bg-green-800' },
];

export default function KanbanComponent({ tasks, onMoveTask, onDeleteTask }: KanbanComponentProps) {
    return (
        <div className="flex gap-3 h-full p-3 min-h-0">
            {COLUMNS.map(col => {
                const colTasks = tasks.filter(t => t.status === col.key);
                return (
                    <div key={col.key} className={`flex flex-col flex-1 bg-gray-800 rounded-lg border-t-2 ${col.accent} min-w-0`}>
                        <div className="px-3 py-2 border-b border-gray-700 flex items-center justify-between shrink-0">
                            <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400">{col.label}</h2>
                            <span className="text-xs text-gray-500">{colTasks.length}</span>
                        </div>
                        <div className="flex-1 overflow-y-auto p-2 space-y-2">
                            {colTasks.map(task => (
                                <div key={task.id} className="p-3 bg-gray-700 rounded border border-gray-600 hover:border-gray-500 transition-colors">
                                    <div className="flex items-start justify-between gap-2">
                                        <span className="text-sm text-gray-100 font-medium leading-snug">{task.title}</span>
                                        <button
                                            onClick={() => onDeleteTask(task)}
                                            className="text-gray-500 hover:text-red-400 transition-colors text-xs shrink-0 leading-none"
                                        >✕</button>
                                    </div>
                                    <div className="flex flex-wrap gap-1 mt-2">
                                        {MOVE_BUTTONS.filter(b => b.key !== col.key).map(b => (
                                            <button
                                                key={b.key}
                                                onClick={() => onMoveTask(task, b.key)}
                                                className={`text-xs px-2 py-0.5 rounded transition-colors ${b.cls}`}
                                            >{b.label}</button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

