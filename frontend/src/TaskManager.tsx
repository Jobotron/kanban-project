import KanbanComponent from "./KanbanComponent.tsx";
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
    return (
        <KanbanComponent tasks={tasks} />
    )
}