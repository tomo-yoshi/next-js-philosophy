'use client';

import { FormEvent, useState, useOptimistic, startTransition } from "react";
import TodoPresentation from "./presentation";
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import { todoSchema, todoUpdateSchema, todoDeleteSchema, type TodoSchema } from '../../schemas';

interface TodoContainerProps {
    initialTodos: TodoSchema[];
}

type OptimisticAction = 
    | { type: 'add'; todo: TodoSchema }
    | { type: 'update'; id: string; completed: boolean }
    | { type: 'delete'; id: string };

const sortTodos = (todos: TodoSchema[]) => {
    return [...todos].sort((a, b) => a.completed ? 1 : b.completed ? -1 : 0);
};

export default function TodoContainer({ initialTodos }: TodoContainerProps) {
    const [title, setTitle] = useState<string>('');
    const [todos, setTodos] = useState<TodoSchema[]>(initialTodos);
    const [optimisticTodos, addOptimisticAction] = useOptimistic<TodoSchema[], OptimisticAction>(
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
    const addTodo = async(newTodo: TodoSchema) => {
        try {
            // Validate the new todo
            todoSchema.parse(newTodo);

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

            return response;

        } catch (error) {
            console.error(error);
            if (error instanceof z.ZodError) {
                alert(error.errors[0].message);
            } else {
                alert('Failed to add todo');
            }
        }
    }

    const addTodoAction = () => {
        if (!title) {
            alert('Title is required');
            return;
        }

        const newTodo: TodoSchema = {
            id: uuidv4(),
            title: title,
            completed: false,
            createdAt: new Date().toISOString(),
        };

        startTransition(async () => {
            // Add optimistic update
            addOptimisticAction({ type: 'add', todo: newTodo });
            // Make the actual API call
            const response = await addTodo(newTodo)

            if (response?.ok) {
                startTransition(() => {
                    setTodos(current => [...current, newTodo]);
                    setTitle('');
                });
            }
        });
    };
    // Add todo end ==========================================

    // Update todo ==========================================
    const updateTodo = async (id: string, completed: boolean) => {
        try {
            const updateData = { id, completed };
            // Validate the update data
            todoUpdateSchema.parse(updateData);

            const response = await fetch(`/api/todos`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updateData),
            });

            if (!response.ok) {
                throw new Error('Failed to update todo');
            }

            return response;

        } catch (error) {
            console.error(error);
            if (error instanceof z.ZodError) {
                alert(error.errors[0].message);
            } else {
                alert('Failed to update todo');
            }
        }
    };

    const handleCheckboxChange = async (id: string) => {
        const todo = todos.find(todo => todo.id === id);

        if (!todo) {
            throw new Error('Todo not found');
        }

        startTransition(async () => {
            // Add optimistic update
            addOptimisticAction({ type: 'update', id, completed: !todo.completed });
            // Make the actual API call
            const response = await updateTodo(id, !todo.completed);

            if (response?.ok) {
                startTransition(() => {
                    setTodos(current => current.map(todo => todo.id === id ? { ...todo, completed: !todo.completed } : todo));
                });
            }
        });
    };
    // Update todo end ==========================================

    // Delete todo ==========================================
    const deleteTodo = async (id: string) => {
        try {
            const deleteData = { id };
            // Validate the delete data
            todoDeleteSchema.parse(deleteData);

            const response = await fetch(`/api/todos`, { 
                method: 'DELETE', 
                body: JSON.stringify(deleteData) 
            });

            return response;

        } catch (error) {
            console.error(error);
            if (error instanceof z.ZodError) {
                alert(error.errors[0].message);
            } else {
                alert('Failed to delete todo');
            }
        }
    };

    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to delete this todo?')) {
            startTransition(async () => {
                // Add optimistic update
                addOptimisticAction({ type: 'delete', id });
                // Make the actual API call
                const response = await deleteTodo(id);

                if (response?.ok) {
                    startTransition(() => {
                        setTodos(todos.filter(todo => todo.id !== id));
                    });
                }
            });
        }
    };
    // Delete todo end ==========================================

    return (
        <section className="p-4">
            <h2 className="invisible">Todo Container</h2>
            <section className="my-6">
                <h3 className="text-lg font-bold">Add Todo</h3>
                <form action={addTodoAction} className="flex gap-2 items-center">
                    <label htmlFor="title" className="flex items-center gap-2">Title:
                        <input className="border border-gray-300 rounded-md p-1" type="text" id="title" name="title" value={title} onChange={handleChange} />
                    </label>
                    <button className="bg-blue-800 text-white px-2 py-1" type="submit">Add</button>
                </form>
            </section>
            <section className="my-6">
                <h3 className="text-lg font-bold">Todo List</h3>
                <TodoPresentation
                    todos={sortTodos(optimisticTodos)}
                    handleCheckboxChange={handleCheckboxChange}
                    handleDelete={handleDelete}
                />
            </section>
        </section>
    );
};
