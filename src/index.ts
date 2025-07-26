// MAIN ENTRY POINT FILE


// const express = require('express');
import express from 'express'; // Importing express for creating the server

// const mysql = require('mysql2');
import mysql from 'mysql2'; // Importing mysql2 for database connection

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// Basic HTTP route
// sampole endpoint
app.get('/', (req, res) => {
  res.send('Server running');
});

// connect database
const db = mysql.createConnection({
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


app.post('/tasks', (req,res) => {
    const sql: string = 'INSERT INTO task (title, description, status) VALUES (?,?,?)';
    const title: string = req.body.title;
    const description: string = req.body.description;
    const status: string = req.body.status;
    if (!title || !description || !status) {
        return res.status(400).json({ error: 'Title, description, and status are required' });
    }

    db.query(sql, [title, description, status], (err, result) => {
        if (err) {
            console.error('Error inserting task:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        else {
            console.log('Task inserted successfully:', result);
            return res.status(201).json({ message: 'Task created successfully'});
        }
    })
});

// retrieve data from the database
app.get('/tasks', (req, res) => {
    const sql: string = 'SELECT * FROM task limit ? offset ?';

    // pagination
    const page = Number(req.query.pageNo) || 1; // retrieves the page number from the query string
    const pageSz = Number(req.query.pageSz) || 10; // retrieves the limit from the query string
    const offset = (page - 1) * pageSz; // calculates how many pages to skip based on page number and limit

    db.query(sql, [pageSz,offset], (err, results) => {
        if (err) {
            console.error('Error retrieving tasks:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        console.log('Task retrieved', results);
        return res.status(200).json(results);
    })
});

app.get('tasks/:id', (req, res) => {
    const taskId = req.params.id;
    const sql : string = 'SELECT * FROM task WHERE id = ?';

    db.query(sql, [taskId], (err, results: any) => {
        if (err) {
            console.error('Error retrieving task:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        console.log('Task retrieved', results[0]); // mysql always returns an array, so we access the first element which the required answer
        return res.status(200).json(results[0]);
    })
})


app.put('/tasks/:id', (req, res) => {
    const taskId = req.params.id; // this is for parameters
    // const taskId = req.body.id; // this is for body
    const title = req.body.title;
    const description = req.body.description;
    const status = req.body.status;
    if (!title || !description || !status) {
        return res.status(400).json({ error: 'Title, description, and status are required' });
    }

    const sql = 'UPDATE task SET title = ?, description = ?, status = ? WHERE id = ?';

    db.query(sql, [title,description,status,taskId], (err, results) => {
        if (err) {
            console.error('Error updating task:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        console.log('Task updated successfully');
        return res.status(200).json({ message: 'Task updated successfully' });
    })
})


app.delete('tasks/:id', (req, res) => {
    const sql = 'DELETE FROM task WHERE id = ?';
    const taskId = req.params.id;

    db.query(sql, [taskId], (err, result) => {
        if (err) {
            console.error('Error deleting task:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        console.log('Deletion complete: ', result);
        return res.status(200).json({ message: 'Task deleted successfully' });
    })
})


// create another for completing the task
// app.post()

// http://localhost:5000/tasks/search?status=PENDING&title=Task1 - for POSTMAN
// another API for search/filter using status or title
app.get('/tasks/search', (req, res) => {
    const status = req.query.status;
    const title = req.query.title;

    if (!status && !title) {
        return res.status(400).json({ error: 'Status and title are required'});
    }

    const sql = 'SELECT * FROM task where status = ? and title like ?';
})


// Start the server
app.listen(PORT, () => {
  console.log(`Express app listening at http://localhost:${PORT}`);
});