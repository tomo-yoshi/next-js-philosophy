import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Connecting to or creating a new SQLite database file
const dbPath = path.join(__dirname, "database.db");
const db = new sqlite3.Database(
    dbPath,
    sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
    (err) => {
        if (err) {
            return console.error(err.message);
        }
        console.log("Connected to the SQlite database.");
    }
);

// Serialize method ensures that database queries are executed sequentially
db.serialize(() => {
    // Create the todos table if it doesn't exist
    db.run(
        `CREATE TABLE IF NOT EXISTS todos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        completed NUMERIC DEFAULT 0,
        createdAt NUMERIC DEFAULT CURRENT_TIMESTAMP
    )`,
        (err) => {
            if (err) {
                return console.error(err.message);
            }
            console.log("Created todos table.");

            // Clear the existing data in the products table
            db.run(`DELETE FROM todos`, (err) => {
                if (err) {
                    return console.error(err.message);
                }
                console.log("All rows deleted from todos");

                const sampleTodos = ['Buy groceries', 'Finish project', 'Clean the house'];

                // Insert new data into the products table
                const insertSql = `INSERT INTO todos(title) VALUES(?)`;

                for (const todo of sampleTodos) {
                    db.run(insertSql, todo, function (err) {
                        if (err) {
                            return console.error(err.message);
                        }
                        const id = this.lastID;

                        console.log(`Rows inserted, ID ${id}`);
                    });
                }

                //   Close the database connection after all insertions are done
                db.close((err) => {
                    if (err) {
                        return console.error(err.message);
                    }
                    console.log("Closed the database connection.");
                });
            });
        }
    );
});
