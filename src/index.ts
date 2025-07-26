// MAIN ENTRY POINT FILE


// const express = require('express');
import express from 'express'; // Importing express for creating the server

// const mysql = require('mysql2');
import mysql from 'mysql2'; // Importing mysql2 for database connection

// Importing the controller function
import { completeTaskController, createTaskController, deleteTaskController, getAllTasksController, getTaskByIdController, updateTaskController } from './controller';

const app = express();
const PORT = process.env.PORT || 5000;



app.use(express.json());

// sample endpoint
app.get('/', (req, res) => {
  res.send('Server running');
});

// connect database
export const db = mysql.createConnection({
    host: 'localhost',      // or your DB host
    user: 'root',           // your DB username
    password: 'root', // your DB password
    database: 'todo'  // your DB name
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the database');

    // db.query('SELECT 1', (err, results) => {
    //     if (err) {
    //         console.error('Error executing query:', err);
    //         return;
    //     }
    //     console.log('Database connection is working:', results);
    // });
});

// Create a task
app.post('/tasks', (req,res) => {
    createTaskController(req, res);
});

// retrieve data from the database
app.get('/tasks', (req, res) => {
    getAllTasksController(req, res);
});

// retrieve a single task by ID
app.get('/tasks/:id', (req, res) => {
    getTaskByIdController(req, res);
})

// update a task
app.put('/tasks/:id', (req, res) => {
    updateTaskController(req, res);
})

// delete a task
app.delete('/tasks/:id', (req, res) => {
    deleteTaskController(req, res);
})

// take id and new status and update the status of the task
app.post('/tasks/id/complete', (req, res) => {
    completeTaskController(req, res);
})


// Start the server
app.listen(PORT, () => {
  console.log(`Express app listening at http://localhost:${PORT}`);
});