const mysql = require("mysql2/promise");

const opts = {
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_DATABASE || "tmt"
}

//console.log(opts);

const pool = mysql.createPool(opts);

module.exports = pool;
