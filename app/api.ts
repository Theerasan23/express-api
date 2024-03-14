import express, { Request, Response } from 'express';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.EXPRESS_PORT;

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    connectionLimit: 10,
});


app.get('/connection', async (req: Request, res: Response) => {

    try {
       
        const connection = await pool.getConnection();
        connection.release();

    } catch (error) {

        const data = [{
            'text': "connection failed server is down",
            'errno': -111,
            'code': 'ECONNREFUSED',
            'syscall': 'connect',
            'address': '127.0.0.1',
            'port': 3306,
            'fatal': true
        }]

        res.json(data);
        process.exit(1);
    }

});

app.get('/', async (req: Request, res: Response) => {
    try {

        const data = [{
            "error": false,
            "message": "Welcome to the API"
        }];

        res.json(data);

    } catch (error) {

        console.error('Error api failed:', error);
        res.status(500).json({ message: 'Internal Server Error' });

    }
});

app.get('/user:id', async (req: Request, res: Response) => {
    try {

        const [rows] = await pool.query('SELECT * FROM your_table WHERE id = ?', [req.params.id]);
        res.json(rows);

    } catch (error) {

        console.error('Error querying database:', error);
        res.status(500).json({ message: 'Internal Server Error' });

    }
});


app.post('/user', async (req: Request, res: Response) => {
    try {

        const [rows] = await pool.query('INSERT INTO your_table (name, email) VALUES (?, ?)', [req.body.name, req.body.email]);
        res.json(rows);

    } catch (error) {

        console.error('Error querying database:', error);
        res.status(500).json({ message: 'Internal Server Error' });

    }
});


app.put('/user:id', async (req: Request, res: Response) => {
    try {

        const [rows] = await pool.query('UPDATE your_table SET name = ?, email = ? WHERE id = ?', [req.body.name, req.body.email, req.params.id]);
        res.json(rows);

    } catch (error) {

        console.error('Error querying database:', error);
        res.status(500).json({ message: 'Internal Server Error' });

    }
});


app.delete('/user:id', async (req: Request, res: Response) => {
    try {

        const [rows] = await pool.query('DELETE FROM your_table WHERE id = ?', [req.params.id]);
        res.json(rows);

    } catch (error) {

        console.error('Error querying database:', error);
        res.status(500).json({ message: 'Internal Server Error' });

    }
});



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});