const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'nv4forbenit',
    database: 'gerenciador'
});
db.connect((err) => {
    if(err) throw err;
    console.log('conectado')
});
module.exports = db;