import './App.css';
import KanbanComponent from "./KanbanComponent.tsx";

export default  function App() {
  return (
      <div>
        <h1>Kanban board</h1>
        <KanbanComponent/>
        <button className="accent-amber-500">add task</button>
      </div>
)
};