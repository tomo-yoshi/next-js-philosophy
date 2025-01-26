import sqlite3 from 'sqlite3';
import { v4 as uuidv4 } from 'uuid';
import { dbPath } from './constant';

// Path to the SQLite database file
// const dbPath = path.join(process.cwd(), '../database/database.db');

// Function to initialize the database
const initializeDatabase = () => {
    // Connecting to or creating a new SQLite database file
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
        // Drop the todos table if it exists
        db.run(`DROP TABLE IF EXISTS todos`, (err) => {
            if (err) {
                return console.error(err.message);
            }
            console.log("Dropped todos table if it existed.");

            // Create the todos table if it doesn't exist
            db.run(
                `CREATE TABLE IF NOT EXISTS todos (
                    id TEXT PRIMARY KEY,
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
                        const insertSql = `INSERT INTO todos(id, title) VALUES(?, ?)`;

                        for (const todo of sampleTodos) {
                            const id = uuidv4();
                            db.run(insertSql, [id, todo], function (err) {
                                if (err) {
                                    return console.error(err.message);
                                }

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
    });
};

export default initializeDatabase;