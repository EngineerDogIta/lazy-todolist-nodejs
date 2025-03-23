import "reflect-metadata"
import { DataSource, DataSourceOptions } from "typeorm"
import { Task } from "../models/Task"
import path from 'path'

const isProduction = process.env.NODE_ENV === 'production'

const baseConfig: Partial<DataSourceOptions> = {
    entities: [Task],
    synchronize: true,
    logging: process.env.NODE_ENV === 'development',
    maxQueryExecutionTime: 1000,
}

const productionConfig: DataSourceOptions = {
    ...baseConfig,
    type: "postgres",
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "5432"),
    username: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "postgres",
    database: process.env.DB_NAME || "todolist",
    ssl: process.env.DB_SSL === 'true',
    extra: {
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
    }
} as DataSourceOptions

const developmentConfig: DataSourceOptions = {
    ...baseConfig,
    type: "sqlite",
    database: path.join(__dirname, '../../data/database.sqlite'),
} as DataSourceOptions

export const AppDataSource = new DataSource(
    isProduction ? productionConfig : developmentConfig
) 