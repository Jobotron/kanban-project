import { useState } from "react";

interface CreateKanbanTaskFormProps {
    onCreate: (title: string, status: string) => Promise<void>;
}

export default function CreateKanbanTaskForm({ onCreate }: CreateKanbanTaskFormProps) {
    const [hidden, setHidden] = useState(true);
    const [title, setTitle] = useState("");
    const [status, setStatus] = useState("todo");

    const showModal = () => setHidden(false);
    const hideModal = () => setHidden(true);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onCreate(title, status).then(() => {
            setTitle("");
            setStatus("todo");
            hideModal();
        });
    };

    return (
        <div>
            <button onClick={showModal}
            className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600'>Add Task</button>
            {!hidden && (
                <div className="fixed inset-0 bg-grey-800/50 flex justify-center items-center z-50">
                    <div className="bg-gray-500 rounded-lg shadow-lg p-6 w-1/2 h-1/2 relative">
                        <button className="absolute top-2 right-2 text-red-500 hover:text-red-600" onClick={hideModal}>&times;</button>
                        <form className="p-10 h-1/2 flex flex-col justify-between" onSubmit={handleSubmit}>
                            <input
                                type="text"
                                placeholder="Task Title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                                className="p-2 border border-gray-300 rounded mb-4"
                            />
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="p-2 border border-gray-300 rounded mb-4"
                            >
                                <option value="todo">To Do</option>
                                <option value="in-progress">In Progress</option>
                                <option value="done">Done</option>
                            </select>
                            <button  type="submit"
                            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">Create Task</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
