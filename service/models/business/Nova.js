const PostgresInstance = require("../PostgresInstance");

class NovoClass{

	nome;
	nomeDeFamilia;
	estadoCivil;

	save(){
		PostgresInstance.runQuery(`INSERT INTO newTable_1625242035465 (nome,nomeDeFamilia,estadoCivil) VALUES ('${this.nome}','${this.nomeDeFamilia}','${this.estadoCivil}')`);
	}

	find(){
		PostgresInstance.runQuery(`SELECT nome,nomeDeFamilia,estadoCivil FROM newTable_1625242035465`);
	}

} 

module.exports = new NovoClass();