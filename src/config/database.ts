import sqlite3 from 'sqlite3';
import { Pool, QueryResult, PoolClient } from 'pg';
import path from 'path';
import logger from './logger';

interface Database {
    run: (sql: string, params: any[], callback: (err: Error | null) => void) => void;
    all: (sql: string, params: any[], callback: (err: Error | null, rows: any[]) => void) => void;
    serialize?: (callback: () => void) => void;
}

const isProduction = process.env.NODE_ENV === 'production';
let db: Database;

if (isProduction) {
    // PostgreSQL configuration for production
    const pool = new Pool({
        user: process.env.DB_USER || 'postgres',
        host: process.env.DB_HOST || 'postgres',
        database: process.env.DB_NAME || 'todolist',
        password: process.env.DB_PASSWORD || 'postgres',
        port: parseInt(process.env.DB_PORT || '5432', 10),
        max: 20, // Maximum number of clients in the pool
        idleTimeoutMillis: 30000, // How long a client is allowed to remain idle before being closed
        connectionTimeoutMillis: 2000, // How long to wait before timing out when connecting a new client
    });

    // Test the connection
    pool.connect((err, client: PoolClient | undefined, release) => {
        if (err) {
            logger.error('Error connecting to PostgreSQL:', err);
        } else if (client) {
            // Create tasks table if it doesn't exist
            client.query(`
                CREATE TABLE IF NOT EXISTS tasks (
                    id SERIAL PRIMARY KEY,
                    title TEXT NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            `, (err) => {
                release();
                if (err) {
                    logger.error('Error creating tasks table:', err);
                }
            });
        }
    });

    // Convert SQLite-style parameter placeholders to PostgreSQL style
    const convertParams = (sql: string): string => {
        let paramIndex = 1;
        return sql.replace(/\?/g, () => `$${paramIndex++}`);
    };

    db = {
        run: (sql: string, params: any[], callback: (err: Error | null) => void) => {
            const pgSql = convertParams(sql);
            // For INSERT queries, modify to return the inserted ID
            if (sql.trim().toUpperCase().startsWith('INSERT')) {
                const modifiedSql = pgSql + ' RETURNING id';
                pool.query(modifiedSql, params, (err: Error | null, result: QueryResult) => {
                    if (err) {
                        callback(err);
                    } else {
                        // Create a context object with lastID to match SQLite behavior
                        callback.call({ lastID: result.rows[0]?.id }, null);
                    }
                });
            } else {
                pool.query(pgSql, params, callback);
            }
        },
        all: (sql: string, params: any[], callback: (err: Error | null, rows: any[]) => void) => {
            const pgSql = convertParams(sql);
            pool.query(pgSql, params, (err: Error | null, result: QueryResult) => {
                if (err) {
                    callback(err, []);
                } else {
                    callback(null, result.rows);
                }
            });
        }
    };
} else {
    // SQLite configuration for development
    const dbPath = path.join(__dirname, '../../data/database.sqlite');
    const sqliteDb = new sqlite3.Database(dbPath);
    
    // Create tasks table if it doesn't exist
    sqliteDb.serialize(() => {
        sqliteDb.run(`CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )`, [], (err) => {
            if (err) {
                logger.error('Error creating tasks table:', err);
            }
        });
    });

    db = {
        run: (sql: string, params: any[], callback: (err: Error | null) => void) => {
            sqliteDb.run(sql, params, callback);
        },
        all: (sql: string, params: any[], callback: (err: Error | null, rows: any[]) => void) => {
            sqliteDb.all(sql, params, callback);
        },
        serialize: (callback: () => void) => {
            sqliteDb.serialize(callback);
        }
    };
}

export default db; 