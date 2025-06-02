import KanbanComponent from "./KanbanComponent.tsx";
import CreateKanbanTaskForm from "./CreateKanbanTaskForm.tsx";
import Task from "./Task.ts";
import {useEffect, useState} from "react";


export default function TaskManager() {
    const [tasks, setTasks] = useState<Task[]>([]);
    useEffect(() => {
        fetch('http://localhost:8080/tasks')
            .then((response) => {
                return response.json();
            })
            .then((data: Task[]) => {
                console.log(data)
                setTasks(data)
            })
            .catch((error) => console.error('Error fetching tasks:', error)
            )
    }, []);

    const createTask = async (title: string, status: string): Promise<void> => {
        try {
            const response = await fetch('http://localhost:8080/tasks', {
                method: 'POST',
                body: JSON.stringify({
                    "title": title,
                    "status": status,
                }),
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const newTask = await response.json();
            setTasks((prevTasks) => [...prevTasks, newTask]);
        } catch (error) {
            console.error('Error creating task:', error);
            throw error;
        }
    }

    return (
        <div className=" h-full w-full">
            <KanbanComponent tasks={tasks} />
            <CreateKanbanTaskForm onCreate={createTask} />
        </div>
    )
}