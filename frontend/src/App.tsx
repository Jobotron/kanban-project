import './App.css'
import TaskManager from "./TaskManager.tsx";

export default  function App() {
    return (
      <div className="h-full w-half border-color-gray-800 drop-shadow border-4 p-4 justify-items justify-content">
        <h1 className="font text-lg box-shadow text-cyan-800 font-semibold mb-2">Kanban</h1>
        <TaskManager />
      </div>
)
};
