# lazy-todolist-nodejs
This is an example of a todo list web app

The web app stores data in a database
right now, the tasks are public, if you add a task, it will be visible to everyone,
Be respectful please

## Setup with Docker

1. Make sure you have Docker and Docker Compose installed
2. Clone this repository
3. Run the following command to start the application:
   ```bash
   docker-compose up --build
   ```
4. The application will be available at http://localhost:8080

The application uses PostgreSQL as the database, which is automatically set up in a Docker container.
