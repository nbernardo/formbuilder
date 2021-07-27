const { Pool } = require("pg");
const DBInstance = require("./interfaces/DBInstance");

class PostgresInstance extends DBInstance {


    pool = new Pool({
        connectionString: `postgres://postgres:1234@localhost:5432/form`
    });

    async getConnection() {
        return await this.pool.connect();
    }

    async runQuery(queryString){

        const client = await this.getConnection();
        const queryResult = await client.query(queryString);
        return queryResult;

    }

}

module.exports = new PostgresInstance();