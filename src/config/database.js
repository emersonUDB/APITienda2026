const mysql = require('mysql2');
const dbConfig = require('./database.config');

const pool = mysql.createPool({
    ...dbConfig,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = pool;
