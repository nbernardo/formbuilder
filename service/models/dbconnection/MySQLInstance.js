const mysql = require("mysql2/promise");
const DBInstance = require("../interfaces/DBInstance");

class MySQLInstance extends DBInstance {

    connection;

    async getConnection() {

        this.connection = mysql.createPool({
            host: 'localhost',
            user: 'root',
            database: 'form',
            password: '1234',
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });
        return await this.connection;

    }

    async runQuery(queryString) {

        const client = await this.getConnection();
        const queryResult = await client.query(queryString);
        client.end();
        console.log(`Run query result`);
        console.log(queryResult);

        return queryResult;

    }

    async query(queryString) {

        const queryResult = await this.connection.query(queryString);
        this.connection.end();
        //this.pool.end();
        return queryResult;

    }

}

module.exports = new MySQLInstance();