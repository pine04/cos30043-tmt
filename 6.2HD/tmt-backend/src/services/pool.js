const mysql = require("mysql2/promise");

const pool = mysql.createPool({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Pinetar@2004",
    database: "tmt"
});

module.exports = pool;