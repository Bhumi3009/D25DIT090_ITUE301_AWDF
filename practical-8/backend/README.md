# Practical 5 - MongoDB Integration and Schema Design with Mongoose

## Problem Statement

Integrate MongoDB with a Node.js and Express.js backend for a Task Management system using Mongoose. Design a Mongoose schema for tasks and implement REST API endpoints for creating, reading, updating, and deleting tasks.

## Technologies Used

- Node.js
- Express.js
- MongoDB
- Mongoose
- Postman

## Project Structure

```text
practical-5/
│
├── middleware/
│   └── errorHandler.js
│
├── models/
│   └── Task.js
│
├── routes/
│   ├── getTasks.js
│   ├── getTaskById.js
│   ├── postTasks.js
│   ├── putTasks.js
│   └── deleteTasks.js
│
├── .env
├── package.json
├── package-lock.json
└── server.js

Task Schema

The Task schema contains:

title - Required string
description - String
completed - Boolean with default value false
createdAt - Date with default value Date.now
priority - String with allowed values low, medium, and high

A pre-save middleware is also used to remove leading and trailing spaces from the task title.

API Endpoints
Method	Endpoint	Description
GET	/tasks	Get all tasks
GET	/tasks/:id	Get a task by ID
POST	/tasks	Create a new task
PUT	/tasks/:id	Update a task
DELETE	/tasks/:id	Delete a task
Error Handling

The application uses global error handling middleware to handle validation errors and return appropriate HTTP status codes.

How to Run

Install dependencies:

npm install

Make sure MongoDB is running and configure the .env file:

MONGO_URI=mongodb://127.0.0.1:27017/taskdb

Start the server:

node server.js

The server runs on:

http://localhost:3000
Testing

The API can be tested using Postman.

The practical demonstrates:

MongoDB connection
Mongoose schema design
CRUD operations
Schema validation
Priority field validation
Pre-save middleware
Global error handling

