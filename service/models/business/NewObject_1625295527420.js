const PostgresInstance = require("../PostgresInstance");

class NewObject_1625295527420{

	modeloDeCarro;
	marcaDoCarro;
	categoria;

	save(){
		PostgresInstance.runQuery(`INSERT INTO newTable_1625295527420 (modeloDeCarro,marcaDoCarro,categoria) VALUES ('${this.modeloDeCarro}','${this.marcaDoCarro}','${this.categoria}')`);
	}

	find(){
		PostgresInstance.runQuery(`SELECT modeloDeCarro,marcaDoCarro,categoria FROM newTable_1625295527420`);
	}

} 

module.exports = new NewObject_1625295527420();