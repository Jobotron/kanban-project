import React, { useState } from 'react';
import './App.css';

const initialTasks = [
  { id: 1, title: 'Task 1', status: 'todo' },
  { id: 2, title: 'Task 2', status: 'inprogress' },
  { id: 3, title: 'Task 3', status: 'done' }
];

function App() {
  const [tasks, setTasks] = useState(initialTasks);

  const moveTask = (task, newStatus) => {
    setTasks(prevTasks =>
      prevTasks.map(t =>
        t.id === task.id ? { ...t, status: newStatus } : t
      )
    );
  };

  const renderTasks = (status) =>
    tasks
      .filter(task => task.status === status)
      .map(task => (
        <div key={task.id} className="p-4 mb-4 bg-white rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">{task.title}</h3>
          {status !== 'todo' && (
            <button
              className="mr-2 text-xs text-blue-500 hover:underline"
              onClick={() => moveTask(task, 'todo')}
            >
              Move to To Do
            </button>
          )}
          {status !== 'inprogress' && (
            <button
              className="mr-2 text-xs text-yellow-500 hover:underline"
              onClick={() => moveTask(task, 'inprogress')}
            >
              Move to In Progress
            </button>
          )}
          {status !== 'done' && (
            <button
              className="text-xs text-green-500 hover:underline"
              onClick={() => moveTask(task, 'done')}
            >
              Move to Done
            </button>
          )}
        </div>
      ));

  return (
    <div className="container mx-auto p-6">
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-gray-100 p-4 rounded-lg">
          <h2 className="text-xl font-bold mb-4">To Do</h2>
          {renderTasks('todo')}
        </div>
        <div className="bg-gray-100 p-4 rounded-lg">
          <h2 className="text-xl font-bold mb-4">In Progress</h2>
          {renderTasks('inprogress')}
        </div>
        <div className="bg-gray-100 p-4 rounded-lg">
          <h2 className="text-xl font-bold mb-4">Done</h2>
          {renderTasks('done')}
        </div>
      </div>
    </div>
  );
}

export default App;

