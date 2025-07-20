import { useState, useEffect } from 'react';
import Task from '../models/Task';

const API_BASE_URL = 'http://localhost:8080';

export function useTasks() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Fetch all tasks
    const fetchTasks = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_BASE_URL}/tasks`);
            if (!response.ok) {
                throw new Error('Failed to fetch tasks');
            }
            const data: Task[] = await response.json();
            setTasks(data);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error fetching tasks';
            setError(errorMessage);
            console.error('Error fetching tasks:', err);
        } finally {
            setLoading(false);
        }
    };

    // Create a new task
    const createTask = async (title: string, status: string): Promise<void> => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_BASE_URL}/tasks`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title,
                    status,
                }),
            });
            
            if (!response.ok) {
                throw new Error('Failed to create task');
            }
            
            const newTask: Task = await response.json();
            setTasks(prevTasks => [...prevTasks, newTask]);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error creating task';
            setError(errorMessage);
            console.error('Error creating task:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Update an existing task
    const updateTask = async (task: Task): Promise<void> => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_BASE_URL}/tasks/${task.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(task),
            });
            
            if (!response.ok) {
                throw new Error('Failed to update task');
            }
            
            const updatedTask: Task = await response.json();
            setTasks(prevTasks => 
                prevTasks.map(t => t.id === updatedTask.id ? updatedTask : t)
            );
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error updating task';
            setError(errorMessage);
            console.error('Error updating task:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Delete a task
    const deleteTask = async (taskId: number): Promise<void> => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
                method: 'DELETE',
            });
            
            if (!response.ok) {
                throw new Error('Failed to delete task');
            }
            
            setTasks(prevTasks => prevTasks.filter(t => t.id !== taskId));
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error deleting task';
            setError(errorMessage);
            console.error('Error deleting task:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Load tasks on mount
    useEffect(() => {
        fetchTasks();
    }, []);

    return {
        tasks,
        loading,
        error,
        fetchTasks,
        createTask,
        updateTask,
        deleteTask,
    };
}
