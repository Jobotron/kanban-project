import KanbanComponent from "./components/KanbanComponent.tsx";
import Task from "./models/Task.ts";
import { useEffect, useState, useRef } from "react";

const API_BASE_URL = 'http://localhost:8080';
const STATUSES = ['todo', 'in-progress', 'done'] as const;
const STATUS_LABELS: Record<string, string> = {
    todo: 'To Do',
    'in-progress': 'In Progress',
    done: 'Done',
};
const MIN_PANE = 12; // minimum pane width in percent

export default function TaskManager() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [filterStatus, setFilterStatus] = useState<string | null>(null);
    const [newTitle, setNewTitle] = useState("");
    const [newStatus, setNewStatus] = useState("todo");

    // Pane widths as percentages [left, center, right]
    const [paneWidths, setPaneWidths] = useState([18, 57, 25]);
    const containerRef = useRef<HTMLDivElement>(null);
    const dragging = useRef<{ divider: number; startX: number; startWidths: number[] } | null>(null);

    useEffect(() => {
        fetch(`${API_BASE_URL}/tasks`)
            .then(r => r.json())
            .then((data: Task[]) => setTasks(data))
            .catch(err => console.error('Error fetching tasks:', err));
    }, []);

    useEffect(() => {
        const onMouseMove = (e: MouseEvent) => {
            if (!dragging.current || !containerRef.current) return;
            const { divider, startX, startWidths } = dragging.current;
            const containerWidth = containerRef.current.offsetWidth;
            const deltaPct = ((e.clientX - startX) / containerWidth) * 100;
            const total = startWidths[divider] + startWidths[divider + 1];
            const newA = Math.max(MIN_PANE, Math.min(startWidths[divider] + deltaPct, total - MIN_PANE));
            const newWidths = [...startWidths];
            newWidths[divider] = newA;
            newWidths[divider + 1] = total - newA;
            setPaneWidths(newWidths);
        };
        const onMouseUp = () => { dragging.current = null; };
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
        };
    }, []);

    const onDividerMouseDown = (divider: number) => (e: React.MouseEvent) => {
        e.preventDefault();
        dragging.current = { divider, startX: e.clientX, startWidths: [...paneWidths] };
    };

    const deleteTask = async (t: Task) => {
        const response = await fetch(`${API_BASE_URL}/tasks`, { method: 'DELETE', body: JSON.stringify(t) });
        if (!response.ok) throw new Error('Failed to delete task');
        setTasks(prev => prev.filter(task => task.id !== t.id));
    };

    const updateTask = async (t: Task) => {
        const response = await fetch(`${API_BASE_URL}/tasks`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(t),
        });
        if (!response.ok) throw new Error('Failed to update task');
        const updated = await response.json();
        setTasks(prev => prev.map(task => task.id === updated.id ? updated : task));
    };

    const handleCreateTask = async (e: React.FormEvent) => {
        e.preventDefault();
        const response = await fetch(`${API_BASE_URL}/tasks`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: newTitle, status: newStatus }),
        });
        if (!response.ok) throw new Error('Failed to create task');
        const created = await response.json();
        setTasks(prev => [...prev, created]);
        setNewTitle("");
        setNewStatus("todo");
    };

    const counts = STATUSES.reduce(
        (acc, s) => ({ ...acc, [s]: tasks.filter(t => t.status === s).length }),
        {} as Record<string, number>
    );
    const filteredTasks = filterStatus ? tasks.filter(t => t.status === filterStatus) : tasks;

    return (
        <div ref={containerRef} className="flex h-full w-full select-none overflow-hidden">

            {/* ── Left Pane: Sidebar ── */}
            <div style={{ width: `${paneWidths[0]}%` }} className="flex flex-col shrink-0 bg-gray-800 overflow-y-auto">
                <div className="p-4 flex-1">
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">Filter</p>
                    <button
                        onClick={() => setFilterStatus(null)}
                        className={`w-full text-left px-3 py-2 rounded mb-1 text-sm flex justify-between items-center transition-colors ${filterStatus === null ? 'bg-cyan-700 text-white' : 'text-gray-300 hover:bg-gray-700'}`}
                    >
                        <span>All Tasks</span>
                        <span className="text-xs opacity-60">{tasks.length}</span>
                    </button>
                    {STATUSES.map(s => (
                        <button
                            key={s}
                            onClick={() => setFilterStatus(s)}
                            className={`w-full text-left px-3 py-2 rounded mb-1 text-sm flex justify-between items-center transition-colors ${filterStatus === s ? 'bg-cyan-700 text-white' : 'text-gray-300 hover:bg-gray-700'}`}
                        >
                            <span>{STATUS_LABELS[s]}</span>
                            <span className="text-xs opacity-60">{counts[s] ?? 0}</span>
                        </button>
                    ))}
                </div>
                <div className="px-4 py-3 border-t border-gray-700">
                    <p className="text-xs text-gray-500">{tasks.length} task{tasks.length !== 1 ? 's' : ''} total</p>
                </div>
            </div>

            {/* ── Resize Handle 0 ── */}
            <div
                className="w-1 shrink-0 bg-gray-700 hover:bg-cyan-500 active:bg-cyan-400 cursor-col-resize transition-colors"
                onMouseDown={onDividerMouseDown(0)}
            />

            {/* ── Center Pane: Kanban Board ── */}
            <div style={{ width: `${paneWidths[1]}%` }} className="flex flex-col shrink-0 overflow-hidden bg-gray-900">
                <div className="px-4 py-2 bg-gray-800 border-b border-gray-700 shrink-0 flex items-center gap-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Board</span>
                    {filterStatus && (
                        <span className="text-xs text-cyan-400">— {STATUS_LABELS[filterStatus]}</span>
                    )}
                </div>
                <div className="flex-1 overflow-auto">
                    <KanbanComponent
                        tasks={filteredTasks}
                        onMoveTask={(task, status) => updateTask({ ...task, status })}
                        onDeleteTask={deleteTask}
                    />
                </div>
            </div>

            {/* ── Resize Handle 1 ── */}
            <div
                className="w-1 shrink-0 bg-gray-700 hover:bg-cyan-500 active:bg-cyan-400 cursor-col-resize transition-colors"
                onMouseDown={onDividerMouseDown(1)}
            />

            {/* ── Right Pane: New Task ── */}
            <div style={{ width: `${paneWidths[2]}%` }} className="flex flex-col shrink-0 bg-gray-800 overflow-y-auto">
                <div className="px-4 py-2 border-b border-gray-700 shrink-0">
                    <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">New Task</span>
                </div>
                <form onSubmit={handleCreateTask} className="flex flex-col gap-3 p-4">
                    <label className="text-xs uppercase tracking-wide text-gray-400">Title</label>
                    <input
                        type="text"
                        value={newTitle}
                        onChange={e => setNewTitle(e.target.value)}
                        required
                        placeholder="Task title…"
                        className="bg-gray-700 border border-gray-600 rounded px-3 py-2 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-cyan-500"
                    />
                    <label className="text-xs uppercase tracking-wide text-gray-400">Status</label>
                    <select
                        value={newStatus}
                        onChange={e => setNewStatus(e.target.value)}
                        className="bg-gray-700 border border-gray-600 rounded px-3 py-2 text-sm text-gray-100 focus:outline-none focus:border-cyan-500"
                    >
                        {STATUSES.map(s => (
                            <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                        ))}
                    </select>
                    <button
                        type="submit"
                        className="mt-1 bg-cyan-600 hover:bg-cyan-500 text-white rounded px-4 py-2 text-sm font-semibold transition-colors"
                    >
                        Create Task
                    </button>
                </form>
            </div>

        </div>
    );
}


