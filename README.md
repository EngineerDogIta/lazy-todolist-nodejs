# Lazy TodoList

A simple todo list application built with Node.js and Express.

## Project Structure

```
src/
  ├── components/     # Reusable UI components and static assets
  ├── config/        # Configuration files
  ├── controllers/   # Route controllers
  ├── lib/          # Utility functions and shared code
  ├── models/       # Database models
  ├── routes/       # Express routes
  ├── services/     # Business logic
  └── views/        # Pug templates
```

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

## Available Scripts

- `npm start` - Start the production server
- `npm run dev` - Start the development server with hot reload
- `npm run lint` - Run ESLint to check code style
- `npm run format` - Format code using Prettier
- `npm test` - Run tests

## Features

- Create, read, update, and delete todos
- Simple and intuitive interface
- SQLite database for data persistence

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.
