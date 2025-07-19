import KanbanComponent from "./components/KanbanComponent.tsx";
import CreateKanbanTaskForm from "./components/CreateKanbanTaskForm.tsx";
import Task from "./models/Task.ts";
import {useEffect, useState} from "react";

const API_BASE_URL = 'http://localhost:8080';

export default function TaskManager() {
    const [tasks, setTasks] = useState<Task[]>([]);
    useEffect(() => {
        fetch(`${API_BASE_URL}/tasks`)
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
            const response = await fetch(`${API_BASE_URL}/tasks`, {
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
    
    const updateTask = async (t: Task): Promise<void> => {
    	try {
        const response = await fetch(`${API_BASE_URL}/tasks/${t.id}`, {
            method: 'PUT',
        body: JSON.stringify(t),
        });
        if (!response.ok) {
            throw new Error("Error updating task")
        }
        const newTask = await response.json()
        setTasks(prevTasks => [...prevTasks, newTask])
        } catch(error) {
            console.error('Error updating task:', error);
            throw error;
        }

    }


    return (
        <div>
            <KanbanComponent tasks={tasks} />
            <CreateKanbanTaskForm onCreate={createTask} />
        </div>
    )
}
