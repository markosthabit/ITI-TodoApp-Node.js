// src/db/migrate.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Open (or create) the database file
const db = new sqlite3.Database(
    path.resolve(__dirname, '../database/data/todos.db'),

    // open the file for reading and writing OR create it if missing
    sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
    err => {
        if (err) console.error(`Path: ${path.resolve(__dirname, '../data/todos.db')}\nDB open error:`, err);
    }
);

// Ensure foreign keys are enforced, 
// as they are off by default.
db.run('PRAGMA foreign_keys = ON;');

// Define & create each table IF NOT EXISTS
const migrations = [
    // Users
    `CREATE TABLE IF NOT EXISTS users (
    id           TEXT PRIMARY KEY,
    userName     TEXT NOT NULL UNIQUE,
    password     TEXT NOT NULL,
    firstName    TEXT NOT NULL,
    lastName     TEXT NOT NULL,
    dateOfBirth  TEXT
    );`,

    // Todos
    `CREATE TABLE IF NOT EXISTS todos (
    id            TEXT PRIMARY KEY,
    user_id       TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title         TEXT NOT NULL,
    status        TEXT NOT NULL,
    creation_time INTEGER NOT NULL,
    update_time   INTEGER NOT NULL
    );`,

    // Tags
    `CREATE TABLE IF NOT EXISTS tags (
    id    TEXT PRIMARY KEY,
    name  TEXT NOT NULL UNIQUE
    );`,

    // Junction todo_tags
    `CREATE TABLE IF NOT EXISTS todo_tags (
    todo_id TEXT NOT NULL REFERENCES todos(id) ON DELETE CASCADE,
    tag_id  TEXT NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (todo_id, tag_id)
    );`
];

// Execute each migration in sequence
function runMigrations() {
    migrations.forEach(sql => {
        db.run(sql, err => {
            if (err) console.error('Migration error:', err.message);
            else console.log('Migration OK');
        });
    });
}

// Export both the db handle and migration runner
module.exports = { db: db, initSqlite: runMigrations };
