const mysql = require("mysql2");

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Prince007@",
    database: "testdb"
});

db.connect((err) => {
    if (err) {
        console.log(err);
        return;
    }

    console.log("Database Connected");
});

module.exports = db;