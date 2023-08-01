# MERN Todo App with Docker Setup

This is a simple MERN (MongoDB, Express, React, Node.js) todo app that allows users to manage their daily tasks efficiently. The app provides a user-friendly interface to create, edit, and delete todo items. This app also supports marking tasks as completed.

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the App](#running-the-app)
- [Testing](#testing)
- [Technologies Used](#technologies-used)
- [Contributing](#contributing)
- [License](#license)

## Features

- Create a new todo item with a title and description.
- Edit existing todo items to modify their details.
- Mark tasks as completed to keep track of the progress.
- Delete todo items when they are no longer needed.

## Prerequisites

Before running the MERN todo app, ensure you have the following installed:

- Docker
- Docker Compose

## Installation

To set up the MERN todo app locally using Docker, follow these steps:

1. Clone the repository to your local machine:

```bash
git clone https://github.com/devDabo/todo_app.git
cd todo_app
```

2. Create a `.env` file in the root directory of the project and set the following environment variables, replacing `<YOUR_MONGODB_URI>` with your actual MongoDB URI:

```plaintext
MONGO_USER=your_mongo_username
MONGO_PASSWORD=your_mongo_password
```

## Running the App

1. Open a terminal and navigate to the root directory of the project.

2. Run the following command to start the app using Docker Compose:

```bash
docker-compose up
```

Docker Compose will build the necessary Docker images and start the MongoDB, backend, and frontend services. The MERN todo app should be up and running at `http://localhost:3000/`.

## Testing

The app includes JEST tests to ensure the correctness of some critical components and functionalities. To run the tests, use the following command:

```bash
docker-compose run client npm test
```

## Technologies Used

- React: Frontend library for building user interfaces.
- Node.js: JavaScript runtime environment for the server-side.
- Express: Web application framework for Node.js.
- MongoDB: NoSQL database for storing todo items.
- Docker: Platform for building, shipping, and running applications in containers.
- Docker Compose: Tool for defining and running multi-container Docker applications.
- Axios: Promise-based HTTP app for making API requests.
- Jest: Testing framework for JavaScript code.

## Contributing

Contributions to the MERN Todo App are welcome and encouraged. If you find a bug or have an idea for improvement, feel free to open an issue or submit a pull request.

1. Fork the repository.
2. Create a new branch for your feature: `git checkout -b feature-name`
3. Commit your changes: `git commit -m "Add some feature"`
4. Push to the branch: `git push origin feature-name`
5. Open a pull request.

## License

The MERN Todo App is open-source and available under the [MIT License](https://github.com/devDabo/todo_app/blob/main/LICENSE). Feel free to use, modify, and distribute the code as per the terms of the license.
