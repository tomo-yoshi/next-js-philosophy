import initializeDatabase from "@/utils/sqlite/setup";

export async function GET() {
    initializeDatabase();
    return new Response('Database initialized');
}
