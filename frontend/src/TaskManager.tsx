import KanbanComponent from "./KanbanComponent.tsx";
import CreateKanbanTaskForm from "./CreateKanbanTaskForm.tsx";
import Task from "./Task.ts";
import {useEffect, useState} from "react";


function createTask(title: string, status: string): Promise<Task> {
    return fetch('http://localhost:8080/tasks', {
        method: 'POST',
        body: JSON.stringify({
                "title": title,
                "status": status,
            }),
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then((data: Task) => {
            console.log('Task created:', data);
            return data;
        })
        .catch((error) => {
            console.error('Error creating task:', error)
            throw error;
        });
}

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
    return (
        <div>
            <KanbanComponent tasks={tasks} />
            <CreateKanbanTaskForm onCreate={createTask} />
        </div>
    )
}