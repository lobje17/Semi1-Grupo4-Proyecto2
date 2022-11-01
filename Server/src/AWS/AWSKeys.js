const mysql = require('mysql2');

const db_connection = mysql.createPool({
  host     : "3.95.137.154",
  user     : "admin",
  password : "Admin123.",
  database : "Ucron",
  port     : 3306,
    dateStrings: true
});
// Connect to MySQL server
function Open() {
    return db_connection
}

exports.Open = Open;

