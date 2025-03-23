import "reflect-metadata"
import { DataSource } from "typeorm"
import { Task } from "../entities/Task"
import path from 'path'
import logger from './logger'

const isProduction = process.env.NODE_ENV === 'production'

export const AppDataSource = new DataSource({
    type: isProduction ? "postgres" : "sqlite",
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "5432"),
    username: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "postgres",
    database: isProduction 
        ? (process.env.DB_NAME || "todolist")
        : path.join(__dirname, '../../data/database.sqlite'),
    entities: [Task],
    synchronize: true, // Be careful with this in production
    logging: process.env.NODE_ENV === 'development',
    maxQueryExecutionTime: 1000, // Log slow queries
    // SQLite-specific settings
    ...((!isProduction) && {
        type: "sqlite",
        synchronize: true,
    }),
    // PostgreSQL-specific settings
    ...(isProduction && {
        type: "postgres",
        ssl: process.env.DB_SSL === 'true',
        extra: {
            max: 20,
            idleTimeoutMillis: 30000,
            connectionTimeoutMillis: 2000,
        }
    })
}) 