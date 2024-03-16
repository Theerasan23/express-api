import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import {Md5} from 'ts-md5';
import mysql, { OkPacket } from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(bodyParser.json());

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
        res.json({ message: 'Connection to the database was successful' });
        connection.release();

    } catch (error) {

        const data = [{
            'text': "connection failed server is down",
            'errno': -111,
            'code': 'ECONNREFUSED',
            'syscall': 'connect',
            'address': '127.0.0.1',
            'port': '-',
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

// test handle 

app.get('/check' , async ( req:Request , res : Response ) =>{ 

    try{

        const [a] = await pool.query('select count(*) as total from log_user_hospitals')
        const [data] = JSON.parse( JSON.stringify(a) )
        
        console.log(data)
        res.json(data.total)


    }catch{
        res.json("error")
    }
    
})


// การรัน post ให้ใช้รูปแบบนี้
app.post('/login' ,  async  (req : Request , res : Response)=>{

    try{

        const username = req.body.username
        const password = Md5.hashStr(req.body.password)
        const [rows] = await pool.query("select * from user_hospitals where username=? and password = ? order by id desc limit 1",[username,password])
        
        const j_data = JSON.stringify(rows);
        const [t_data] = JSON.parse(j_data)
    
        const return_data = {
            "status" : true,
            "userId" : t_data.id,
            "login" : "success",
            "by" : req.ip,
            "total": Object.keys(rows).length
        }

        res.json(return_data)


    }catch{
        res.json([{ "error":"error select data", "status" : res.status(302) }])
    }

})

app.get('/user/:id/:encrypt', async (req: Request, res: Response) => {
    try {


        if(req.params.encrypt != null){

            const [rows] = await pool.query('SELECT * FROM user_hospitals WHERE id = ?', [req.params.id]);
            res.json(rows);


        }else{

            const data = [{

                "error": "encrypt key is required to access this endpoint",
                "code": "ECONNREFUSED",
            }]

            res.json(data);

        }

        

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