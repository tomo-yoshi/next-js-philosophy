'use server';

import { openDatabase } from "@/utils/sqlite/db";
import { todoSchema, todoUpdateSchema, todoDeleteSchema } from './schemas';
import { z } from 'zod';

export const fetchTodos = async () => {
    try {
        const db = await openDatabase();
        const data = await db.all('SELECT * FROM todos;');
        return data;
    } catch (error) {
        console.error('Error fetching todos:', error);
        throw new Error('Failed to fetch todos');
    }
};

export const createTodo = async (todo: z.infer<typeof todoSchema>) => {
    try {
        const validatedTodo = todoSchema.parse(todo);
        const db = await openDatabase();
        await db.run(
            'INSERT INTO todos (id, title) VALUES (?, ?)',
            [validatedTodo.id, validatedTodo.title]
        );
        return { ok: true, message: 'Todo created successfully' };
    } catch (error) {
        if (error instanceof z.ZodError) {
            return { ok: false, error: error.errors[0].message };
        }
        return { ok: false, error: 'Failed to create todo' };
    }
};

export const updateTodo = async (todo: z.infer<typeof todoUpdateSchema>) => {
    try {
        const validatedTodo = todoUpdateSchema.parse(todo);
        const db = await openDatabase();
        await db.run(
            'UPDATE todos SET completed = ? WHERE id = ?',
            [validatedTodo.completed, validatedTodo.id]
        );
        return { ok: true };
    } catch (error) {
        if (error instanceof z.ZodError) {
            return { ok: false, error: error.errors[0].message };
        }
        return { ok: false, error: 'Failed to update todo' };
    }
};

export const deleteTodo = async (data: z.infer<typeof todoDeleteSchema>) => {
    try {
        const validatedData = todoDeleteSchema.parse(data);
        const db = await openDatabase();
        await db.run('DELETE FROM todos WHERE id = ?', [validatedData.id]);
        return { ok: true };
    } catch (error) {
        if (error instanceof z.ZodError) {
            return { ok: false, error: error.errors[0].message };
        }
        return { ok: false, error: 'Failed to delete todo' };
    }
};