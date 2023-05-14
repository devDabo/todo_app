# Todo Application with MongoDB, Express, React and Node

This is a simple Todo application built using MongoDB, Express, React and Node. It allows users to create, read, update and delete their tasks.

## Prerequisites

Before you get started, you will need the following:

- [Node.js](https://nodejs.org/) installed on your machine
- [Studio 3T](https://studio3t.com/) installed for MongoDB database management

## Installation

1. Clone this repository to your local machine:

```sh
git clone https://github.com/devdabo/todo_app.git
```

2. Navigate to the cloned repository:

```sh
cd todo_app
```

3. Install dependencies:

```sh
npm install
```

4. Start the server:

```sh
npm start
```

5. Open Studio 3T and connect to your MongoDB instance. Create a new database called `todo` and a collection called `todos`.

6. Update the MongoDB connection details in `server.js` file:

```javascript
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/todo', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Failed to connect to MongoDB', error);
  });
```

Make sure to replace the connection string `mongodb://localhost:27017/todo` with your own MongoDB connection string.

7. Save the changes to `server.js` and restart the server.

8. Navigate to `http://localhost:4000` to use the application.

## Usage

The Todo application provides the following endpoints:

### `POST /createtodo`

Creates a new task. The request body should contain the following fields:

- `title` (required): the title of the task
- `description` (optional): the description of the task

### `GET /todos`

Returns a list of all tasks.

### `GET /todos/:id`

Returns a single task with the specified ID.

### `PUT /todos/:id`

Updates a task with the specified ID. The request body should contain the following fields:

- `title` (required): the updated title of the task
- `description` (optional): the updated description of the task

### `DELETE /todos/:id`

Deletes a task with the specified ID.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
