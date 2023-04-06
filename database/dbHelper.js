const mysql = require('mysql2');

class DatabaseHelper {
    static connectDatabase = (database) => {

        const conn = mysql.createConnection({
            "user": "root",
            "host": "localhost",
            "password": "root",
            "port": 3306,
            "database": database
        });

        conn.connect(() => {
            console.log(`${database} database connect Successfully.`)
        })
    }
}

module.exports=DatabaseHelper;