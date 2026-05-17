import './App.css'
import TaskManager from "./TaskManager.tsx";

export default function App() {
    return (
        <div className="flex flex-col h-screen w-screen bg-gray-900 text-gray-100 overflow-hidden">
            <header className="flex items-center px-5 py-2 bg-gray-800 border-b border-gray-700 shrink-0">
                <span className="text-sm font-bold tracking-widest text-cyan-400 uppercase">Kanban</span>
            </header>
            <div className="flex-1 overflow-hidden">
                <TaskManager />
            </div>
        </div>
    );
}
