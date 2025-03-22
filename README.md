# Lazy TodoList

A simple todo list application built with Node.js and Express.

## Project Structure

- src/
  - config/
    - logger.ts         # Winston logger configuration
    - database.ts       # SQLite database configuration
  - controllers/        # Route controllers
  - public/            # Static assets (CSS, JS, images)
  - routes/            # Express routes
  - views/             # Pug templates
  - index.ts           # Application entry point
- logs/                # Application logs
- data/                # Database files
- package.json         # Project dependencies and scripts

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

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

## Development

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:8080`

## Production

To run the application in production mode:

```bash
NODE_ENV=production npm start
```

## Docker Deployment

The application can be deployed using Docker with PostgreSQL as the production database.

### Prerequisites

- Docker
- Docker Compose

### Production Deployment

1. Build and start the containers:

```bash
docker-compose up --build
```

The application will be available at `http://localhost:8080`

### Environment Variables

The following environment variables can be configured in the docker-compose.yml file:

- `DB_USER`: PostgreSQL username (default: postgres)
- `DB_HOST`: PostgreSQL host (default: postgres)
- `DB_NAME`: PostgreSQL database name (default: todolist)
- `DB_PASSWORD`: PostgreSQL password (default: postgres)
- `DB_PORT`: PostgreSQL port (default: 5432)

### Development

For local development, the application uses SQLite as the database. To run the application locally:

```bash
npm install
npm run dev
```

The SQLite database will be created in the `data` directory.

## Available Scripts

- `npm start` - Start the production server
- `npm run dev` - Start the development server with hot reload
- `npm run build` - Build the application for production
- `npm run clean` - Clean the dist directory
- `npm run lint` - Run ESLint to check code style
- `npm run format` - Format code using Prettier
- `npm test` - Run tests

## Features

- Create, read, update, and delete todos
- Simple and intuitive interface
- SQLite database for data persistence
- Comprehensive logging system with Winston
- Environment-specific configurations
- Error handling and monitoring
- Request logging with performance tracking
- Pug templating engine
- TypeScript support
- ESLint and Prettier for code quality

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

## Environment Variables

- `NODE_ENV` - Application environment (development/production)
- `PORT` - Server port (default: 8080)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.
