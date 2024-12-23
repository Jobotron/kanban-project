import './App.css';
import KanbanComponent from "./KanbanComponent.tsx";

export default  function App() {
  return (
      <div>
        <h1>Kanban board</h1>
        <KanbanComponent/>
        <button className="border-t">add task</button>
      </div>
)
};
