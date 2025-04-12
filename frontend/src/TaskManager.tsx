import KanbanComponent from "./KanbanComponent.tsx";
import Task from "./Task.ts";
import {useEffect, useState} from "react";

export default function TaskManager() {
    const [tasks, setTasks] = useState<Task[]>([]);
    useEffect(() => {
        fetch('localhost:8080/tasks/')
            .then((response) => response.json())
            .then((data: Task[]) => setTasks(data))
            .catch((error) => console.error('Error fetching tasks:', error)
        )
    }, []);
    return (
        <KanbanComponent tasks={tasks} />
    )
}