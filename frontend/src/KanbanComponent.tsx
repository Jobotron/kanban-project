import {useState} from 'react';
import Task from "./Task.ts";

interface KanbanComponentProps {
    tasks: Readonly<Task[]>;
}


export default function KanbanComponent({ tasks }: Readonly<KanbanComponentProps>) {
    const [taskList, setTaskList] = useState(tasks);

    const moveTask = (task: Task, newStatus: string) => {
        setTaskList(prevTasks =>
            prevTasks.map(t =>
                t.id === task.id ? { ...t, status: newStatus } : t
            )
        );
    };
    const renderTasks = (status: string) =>
        taskList
            .filter(task => task.status === status)
            .map(task => (
                <div key={task.id} className="p-4 mb-4 bg-white rounded-lg shadow">
                    <h3 className="text-lg text-cyan-950 font-semibold mb-2">{task.title}</h3>
                    {status !== 'todo' && (
                        <button
                            className="mr-2 text-xs text-blue-500 hover:underline"
                            onClick={() => moveTask(task, 'todo')}
                        >
                            Move to To Do
                        </button>
                    )}
                    {status !== 'in-progress' && (
                        <button
                            className="mr-2 text-xs text-yellow-500 hover:underline"
                            onClick={() => moveTask(task, 'in-progress')}
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
                <div className="bg-blue-600 p-4 rounded-lg">
                    <h2 className="text-xl font-bold mb-4">To Do</h2>
                    {renderTasks('todo')}
                </div>
                <div className="bg-blue-600 p-4 rounded-lg">
                    <h2 className="text-xl font-bold mb-4">In Progress</h2>
                    {renderTasks('in-progress')}
                </div>
                <div className="bg-blue-600 p-4 rounded-lg">
                    <h2 className="text-xl font-bold mb-4">Done</h2>
                    {renderTasks('done')}
                </div>
            </div>
        </div>
    );
}
