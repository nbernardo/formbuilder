const DBInstance = require("../interfaces/DBInstance");
const { Client } = require("@elastic/elasticsearch");




class ElasticSearchInsance extends DBInstance {

    getConnection() {

        const connection = new Client({
            nodes: ["http://localhost:9200"]
        })

        return connection;

    }


    runQuery() {

    }

    async addIndex(index){

        const result = await this.getConnection().index({...index});
        return result;
    }


    async createMapping({ index, mappingObj }) {

        let result;

        try {

            result = await this.getConnection().indices.create({
                index,
                body: mappingObj
            });
            console.log(`OK | Indece criado com sucesso ${index}`);
            console.log(result);

        } catch (error) {

            console.log(`Falha vamos | Erro ao criar o indice com nome ${index}`);
            console.log(error);

        }
    }


    async updateMapping({ index, props }) {

        try {
            
            let result = await this.getConnection().indices.putMapping({
                index,
                body: props
            });
    
            console.log(`OK | Indice actualizado com sucesso com os campos:`);
            console.log(JSON.stringify(props));

        } catch (error) {
            
            console.log(`Falha | Erro a actualizar o mapa do indice porque`);
            console.log(error);

        }

    }

}


module.exports = new ElasticSearchInsance();


/* 
const eli = new ElasticSearchInsance();
props = {
    properties: {
        "nomeEscola" : {type: "text"},
        "aluno": {
            type: "nested",
            properties: {
                "nacionalidade": {type: "text"}
            }
        }
    }
}
eli.updateMapping({index: "forminterfaces/DBInstancebuilder1", props})
*/

/* 
const mappingObj = {
    "mappings": {
        properties: {
            "aluno": {
                type: "nested",
                properties: {
                    "nome": { type: "text" },
                    "idade": { type: "integer" },
                    "genero": { type: "keyword" }
                }
            },
        }
    }
}

eli.createMapping({ index: "formbuilder1", mappingObj });

 */