import { openDatabase } from "@/utils/sqlite/db";

const db = await openDatabase();

export async function POST(request: Request) {
    try {
        const body = await request.json();
        console.log(body);
        
        if (!body.id || !body.title) {
            return new Response('Missing required fields: id and title', { status: 400 });
        }

        await db.run(`INSERT INTO todos (id, title) VALUES (?, ?)`, [body.id, body.title]);
        return new Response('New todo was successfully added.', { status: 201 });
    } catch (error) {
        console.error('Error adding todo:', error);
        return new Response(
            'Failed to add todo: ' + (error instanceof Error ? error.message : 'Unknown error'),
            { status: 500 }
        );
    }
};

export async function PATCH(request: Request) {
    try {
        const body = await request.json();
        console.log(body);

        if (!body.id || body.completed === undefined) {
            return new Response('Missing required fields: id and completed status', { status: 400 });
        }

        await db.run(`UPDATE todos SET completed = ? WHERE id = ?`, [body.completed, body.id]);
        return new Response('Todo was successfully updated.', { status: 200 });
    } catch (error) {
        console.error('Error updating todo:', error);
        return new Response(
            'Failed to update todo: ' + (error instanceof Error ? error.message : 'Unknown error'),
            { status: 500 }
        );
    }
};

export async function DELETE(request: Request) {
    try {
        const body = await request.json();
        console.log(body);

        await db.run(`DELETE FROM todos WHERE id = ?`, [body.id]);
        return new Response('Todo was successfully deleted.', { status: 200 });
    } catch (error) {
        console.error('Error deleting todo:', error);
        return new Response(
            'Failed to delete todo: ' + (error instanceof Error ? error.message : 'Unknown error'),
            { status: 500 }
        );
    }
};