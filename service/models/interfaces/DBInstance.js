/**
 * @abstract
 */
class DBInstance{

    getConnection(){}

    async runQuery(queryString){}

}


module.exports = DBInstance;