import './App.css'
import TaskManager from "./TaskManager.tsx";

export default  function App() {
    return (
      <div className="h-full w-full bg-white justify-items justify-content">
        <h1 className="text-lg text-cyan-950 font-semibold mb-2">Kanban</h1>
          <TaskManager />
      </div>
)
};
