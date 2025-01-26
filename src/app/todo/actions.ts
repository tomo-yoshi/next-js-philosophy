'use server';

import { openDatabase } from "@/utils/sqlite/db";

export const fetchTodos = async () => {
    const db = await openDatabase();
    const data = await db.all('SELECT * FROM todos;');
    return data;
};