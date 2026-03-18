const express=require('express');
const mysql=require('mysql2/promise');
const cors=require('cors');  

const app=express();
const port=8000;

let conn=null;

const userRoutes = require('./routes/user');
const adminRoutes = require('./routes/admin');
const bothRoutes = require('./routes/both');

app.use(cors()); 
app.use(express.json());

app.use((req, res, next) => {
    req.conn = conn;
    next();
});//ให้รู้จักกับตัวแปร conn ในทุกๆ route


app.use('/users', userRoutes);
app.use('/admins', adminRoutes);
app.use('/both', bothRoutes);

const initMySQL = async () => {
    conn=await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'webdb',
        port: 3307
    });
}

app.listen(port, async () => {
    await initMySQL();
    console.log(`Server is running on port ${port}`);
});