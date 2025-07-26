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
    const deleteTask = async(t: Task): Promise<void> => {
    	try {
		    console.log("deleting task.")
		    const response = await fetch(`${API_BASE_URL}/tasks`, {
			    method: 'DELETE',
			    body: JSON.stringify(t)
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Error deleting task:', errorText);
                throw new Error("Error deleting task");
            }
            setTasks(prevTasks => prevTasks.filter(task => task.id !== t.id)); // CORRECT - removes the task
            console.log('Task deleted successfully');
        }

         catch (error) {
            console.error('Error deleting task:', error);
            throw error;
        }
    }
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
            console.log('Updating task:', t);
            const response = await fetch(`${API_BASE_URL}/tasks`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(t),
            });
            if (!response.ok) {
                const errorText = await response.text();
                console.error('Error updating task:', errorText);
                throw new Error("Error updating task")
            }
            const newTask = await response.json()
            console.log('Task updated:', newTask);
            setTasks(prevTasks => prevTasks.map(task => task.id === newTask.id ? newTask : task)) // CORRECT - replaces
        } catch(error) {
            console.error('Error updating task:', error);
            throw error;
        }

    }

    const handleMoveTask = async (task: Task, newStatus: string) => {
        const updatedTask = { ...task, status: newStatus };
        console.log('Moving task:', updatedTask);
        await updateTask(updatedTask);
    };
    const handleDeleteTask = async (task: Task) => {
    	await deleteTask(task);
    }

    
    return (
        <div>
            <KanbanComponent onDeleteTask={handleDeleteTask} onMoveTask={handleMoveTask} tasks={tasks} />
            <CreateKanbanTaskForm onCreate={createTask} />
        </div>
    )
}
