// controllers are responsible for input validation, business logic, and response formatting

import { db } from ".";
import { Task } from "./interfaces";

export function createTaskController(req: any,res: any) {
    const title: string = req.body.title;
    const description: string = req.body.description;
    const status: string = req.body.status;
    if (!title || !description || !status) {
        return res.status(400).json({ error: 'Title, description, and status are required' });
    }

    const sql: string = 'INSERT INTO task (title, description, status) VALUES (?,?,?)';

    db.query(sql, [title, description, status], (err: any, result: any) => {
        if (err) {
            console.error('Error inserting task:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        else {
            console.log('Task inserted successfully:', result);
            return res.status(201).json({ message: 'Task created successfully'});
        }
    })
}


export function getAllTasksController(req: any, res: any) {
    let sql: string = 'SELECT * FROM task';

    // pagination
    const page = Number(req.query.pageNo) || 1; // retrieves the page number from the query string
    const pageSz = Number(req.query.pageSz) || 10; // retrieves the limit from the query string
    const offset = (page - 1) * pageSz; // calculates how many pages to skip based on page number and limit

    // search using filters
    const status = req.query.status;
    const title = req.query.title;
    if(status) {
        // add to the query
        sql += ' WHERE status = ?';
    }
    if (title) {
        sql += status ? ' AND title = ?' : ' WHERE title = ?';
    }

    sql += ' LIMIT ? OFFSET ?'; // add pagination to the query

    db.query(sql, [pageSz,offset], (err, results) => {
        if (err) {
            console.error('Error retrieving tasks:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        console.log('Task retrieved', results);
        return res.status(200).json(results);
    })
}

export function getTaskByIdController(req: any, res: any) {
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
}

export function updateTaskController(req: any, res: any) {
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
}

export function deleteTaskController(req: any, res: any) {
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
}

export function completeTaskController(req: any, res: any) {
    const taskId = req.body.id; // id sent by the user
    const status = 'completed'; // new status

    const sql = 'UPDATE task SET status = ? WHERE id = ?';
    
    db.query(sql, [status, taskId], (err, results) => {
        if (err) {
            console.error('Error completing task:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        console.log('Task completed successfully');
        return res.status(200).json({ message: 'Task completed successfully' });
    })
}