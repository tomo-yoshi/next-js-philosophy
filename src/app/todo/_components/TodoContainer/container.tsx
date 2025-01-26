'use client';

import { Todo } from "@/types";
import { FormEvent, useState, useOptimistic, startTransition } from "react";
import TodoPresentation from "./presentation";
import { v4 as uuidv4 } from 'uuid';

interface TodoContainerProps {
    initialTodos: Todo[];
}

type OptimisticAction = 
    | { type: 'add'; todo: Todo }
    | { type: 'update'; id: string; completed: boolean }
    | { type: 'delete'; id: string };

const sortTodos = (todos: Todo[]) => {
    return [...todos].sort((a, b) => a.completed ? 1 : b.completed ? -1 : 0);
};

export default function TodoContainer({ initialTodos }: TodoContainerProps) {
    const [title, setTitle] = useState<string>('');
    const [todos, setTodos] = useState<Todo[]>(initialTodos);
    const [optimisticTodos, addOptimisticAction] = useOptimistic<Todo[], OptimisticAction>(
        todos,
        (state, action) => {
            switch (action.type) {
                case 'add':
                    return [...state, action.todo];
                case 'update':
                    return state.map(todo => 
                        todo.id === action.id ? { ...todo, completed: action.completed } : todo
                    );
                case 'delete':
                    return state.filter(todo => todo.id !== action.id);
                default:
                    return state;
            }
        }
    );

        const handleChange = (e: FormEvent<HTMLInputElement>) => {
        setTitle(e.currentTarget.value);
    };

    // Add todo ==========================================
    const addTodo = async(newTodo: Todo) => {
        try {
            const response = await fetch('/api/todos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newTodo),
            });

            if (!response.ok) {
                throw new Error('Failed to add todo');
            }

            setTodos(current => [...current, newTodo]);
        } catch (error) {
            console.error(error);
            alert('Failed to add todo');
        };
    }

    const addTodoAction = () => {
        if (!title) {
            alert('Title is required');
            return;
        }

        const newTodo: Todo = {
            id: uuidv4(),
            title: title,
            completed: false,
            createdAt: new Date().toISOString(),
        };

        startTransition(() => {
            // Add optimistic update
            addOptimisticAction({ type: 'add', todo: newTodo });
            // Make the actual API call
            addTodo(newTodo);
            // Reset the title
            setTitle('');
        });
    };
    // Add todo end ==========================================
    
    // Update todo ==========================================
    const updateTodo = async (id: string, completed: boolean) => {
        try {
            const response = await fetch(`/api/todos`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id, completed }),
            });

            if (!response.ok) {
                throw new Error('Failed to update todo');
            }

            setTodos(current => current.map(todo => todo.id === id ? { ...todo, completed } : todo));
        } catch (error) {
            console.error(error);
            alert('Failed to update todo');
        }
    };

    const handleCheckboxChange = async (id: string) => {
        const todo = todos.find(todo => todo.id === id);

        if (!todo) {
            throw new Error('Todo not found');
        }

        startTransition(() => {
            // Add optimistic update
            addOptimisticAction({ type: 'update', id, completed: !todo.completed });
            // Make the actual API call
            updateTodo(id, !todo.completed);
        });
    };
    // Update todo end ==========================================

    // Delete todo ==========================================
    const deleteTodo = async (id: string) => {
        try {
            await fetch(`/api/todos`, { method: 'DELETE', body: JSON.stringify({ id }) });
            setTodos(todos.filter(todo => todo.id !== id));
        } catch (error) {
            console.error(error);
            alert('Failed to delete todo');
        }
    };

    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to delete this todo?')) {
            startTransition(() => {
                // Add optimistic update
                addOptimisticAction({ type: 'delete', id });
                // Make the actual API call
                deleteTodo(id);
            });
        }
    };
    // Delete todo end ==========================================

    return (
        <section className="p-4">
            <h2 className="invisible">Todo Container</h2>
            <form action={addTodoAction} className="flex gap-2 items-center">
                <label htmlFor="title">Title:
                    <input className="border" type="text" id="title" name="title" value={title} onChange={handleChange} />
                </label>
                <button className="bg-blue-800 text-white px-2 py-1" type="submit">Add</button>
            </form>
            <TodoPresentation
                todos={sortTodos(optimisticTodos)}
                handleCheckboxChange={handleCheckboxChange}
                handleDelete={handleDelete}
            />
        </section>
    );
};
