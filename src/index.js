// MAIN ENTRY POINT FILE
const express = require('express');
const http = require('http'); // Required to create raw HTTP server

const app = express();
const PORT = process.env.PORT || 5000;

// Create HTTP server from express app
const server = http.createServer(app);

app.use(express.json());

// Basic HTTP route
// sampole endpoint
app.get('/', (req, res) => {
  res.send('Server running');
});

// connect database
const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',      // or your DB host
    user: 'root',           // your DB username
    password: 'root', // your DB password
    database: 'history'  // your DB name
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the database');
});


app.post('/tasks', (req,res) => {
    const sql = 'INSERT INTO task (title, description, status) VALUES (?,?,?)';
    const title = req.body.title;
    const description = req.body.description;
    const status = req.body.status;
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
    const sql = 'SELECT * FROM task';

    db.query(sql, (err, results) => {
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

    // pagination
    const page = parseInt(req.query.page) || 1; // retrieves the page number from the query string
    const limit = parseInt(req.query.limit) || 10; // retrieves the limit from the query string
    const offset = (page - 1) * limit; // calculates how many pages to skip based on page number and limit

    const sql = 'SELECT * FROM task WHERE id = ? page ? limit ? offset ?';

    db.query(sql, [taskId,page,limit,offset], (err, results) => {
        if (err) {
            console.error('Error retrieving task:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        console.log('Task retrieved', results[0]); // why?
        return res.status(200).json(results[0]);
    })
})


app.put('/tasks/:id', (req, res) => {
    const taskId = req.params.id;
    const title = req.body.title;
    const description = req.body.description;
    const status = req.body.status;
    if (!title || !description || !status) {
        return res.status(400).json({ error: 'Title, description, and status are required' });
    }

    const sql = 'UPDATE task SET title = ?, description = ?, status = ? WHERE id = ?';

    db.query(sql, [title,description,status,taskId], (req, res) => {
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


// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});