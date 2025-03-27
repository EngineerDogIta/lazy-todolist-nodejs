# Lazy TodoList

![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)

A simple, efficient todo list application built with Node.js and Express. Perfect for personal task management with a clean, intuitive interface.

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
  - [Development](#development)
  - [Production](#production)
- [Docker Deployment](#docker-deployment)
- [Configuration](#configuration)
- [Available Scripts](#available-scripts)
- [Project Structure](#project-structure)
- [Logging](#logging)
- [Database](#database)
- [Development Tools](#development-tools)
- [Contributing](#contributing)
- [License](#license)

## Features

- ✨ Create, read, update, and delete todos
- 🎨 Simple and intuitive interface
- 💾 SQLite database for data persistence
- 📝 Comprehensive logging system with Winston
- ⚙️ Environment-specific configurations
- 🛡️ Error handling and monitoring
- 📊 Request logging with performance tracking
- 🎯 Pug templating engine
- 📘 TypeScript support
- 🧹 ESLint and Prettier for code quality

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- Git

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/lazy-todolist-nodejs.git
   cd lazy-todolist-nodejs
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory (optional):

   ```env
   NODE_ENV=development
   PORT=8080
   ```

## Usage

### Development

Start the development server with hot reloading:

```bash
npm run dev
```

The application will be available at `http://localhost:8080`

### Production

To run the application in production mode:

```bash
NODE_ENV=production npm start
```

## Docker Deployment

The application can be deployed using Docker with PostgreSQL as the production database.

### Docker Prerequisites

- Docker
- Docker Compose

### Production Deployment

1. Build and start the containers:

   ```bash
   docker-compose up --build
   ```

2. The application will be available at `http://localhost:8080`

### Local Development with Docker

For local development using Docker:

```bash
docker-compose -f docker-compose.dev.yml up --build
```

## Configuration

### Environment Variables

The following environment variables can be configured:

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Application environment | development |
| `PORT` | Server port | 8080 |
| `DB_USER` | PostgreSQL username | postgres |
| `DB_HOST` | PostgreSQL host | postgres |
| `DB_NAME` | PostgreSQL database name | todolist |
| `DB_PASSWORD` | PostgreSQL password | postgres |
| `DB_PORT` | PostgreSQL port | 5432 |

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start the production server |
| `npm run dev` | Start the development server with hot reload |
| `npm run build` | Build the application for production |
| `npm run clean` | Clean the dist directory |
| `npm run lint` | Run ESLint to check code style |
| `npm run format` | Format code using Prettier |
| `npm test` | Run tests |

## Project Structure

```text
src/
├── config/
│   ├── logger.ts         # Winston logger configuration
│   └── database.ts       # SQLite database configuration
├── controllers/          # Route controllers
├── public/              # Static assets (CSS, JS, images)
├── routes/              # Express routes
├── views/               # Pug templates
└── index.ts             # Application entry point
```

## Logging

The application uses Winston for structured logging with the following features:

- Multiple log levels (error, warn, info, debug)
- Environment-specific log formats:
  - Development: Colorized console output with timestamps
  - Production: JSON format with full error stack traces
- Separate log files for errors and combined logs
- Log rotation with 5MB file size limit and 5 files retention
- Request logging with duration, status, and user agent info
- Structured error tracking with context

Logs are stored in:

- Error logs: `logs/error.log`
- Combined logs: `logs/combined.log`

## Database

SQLite database with automatic table creation:

- Location: `data/database.sqlite`
- Tables:
  - tasks (id, title, createdAt, updatedAt)

## Development Tools

- TypeScript for type-safe development
- ts-node-dev for hot reloading
- ESLint with TypeScript support
- Prettier for code formatting
- Jest for testing

## Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR
- Add meaningful commit messages

## License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.
