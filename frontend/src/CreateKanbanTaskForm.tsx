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
            <button onClick={showModal}>Add Task</button>
            {!hidden && (
                <div className="modal">
                    <div className="modal-content">
                        <button className="close" onClick={hideModal}>&times;</button>
                        <form onSubmit={handleSubmit}>
                            <input
                                type="text"
                                placeholder="Task Title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                            >
                                <option value="todo">To Do</option>
                                <option value="in-progress">In Progress</option>
                                <option value="done">Done</option>
                            </select>
                            <button type="submit">Create Task</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}