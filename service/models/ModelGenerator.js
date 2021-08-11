const FileSys = require('./interfaces/FileSystem');
const DBInstance = require("./interfaces/DBInstance");
const ES = require('./dbconnection/ElasticSearchInsance');
const { indexNameExtract } = require('../util/stringUtil');

module.exports = class ModelGenerator {

    fields = [];
    fieldsType = [];
    modelContent = null;
    tableName;
    modelName = null;
    foreignModel = null;
    jsonFields = {mappings:{properties: {}}};

    constructor(name){
        this.modelName = name;
    }

    newJSONModel({engine}) {
        return this.getModelFields().name();
    }

    newModel() {

        const number = (new Date()).getTime();
        this.tableName = `newTable_${number}`;

        if(this.modelName != this.foreignModel)
            this.fields.push(`id${this.foreignModel}`);

        let fields = this.fields;
        
        let modelContent = `const PostgresInstance = require("../dbconnection/PostgresInstance");\n\nclass ${this.modelName}{\n`;

        for (let idx in fields) {
            modelContent += `\n\t${fields[idx].field};`;
            //console.log(`Na linha ${idx}: ${modelContent}`);
        }

        const saveString = this.generateSaveString();
        modelContent += `\n\n\tsave(){\n\t\treturn PostgresInstance.runQuery(\`${saveString}\`);\n\t}`;

        const findString = this.generateFindString();
        modelContent += `\n\n\tfind(){\n\t\treturn PostgresInstance.runQuery(\`${findString}\`);\n\t}`;

        const findLast = this.generateFindLastInsert();
        modelContent += `\n\n\tfindLast(){\n\t\treturn PostgresInstance.runQuery(\`${findLast}\`);\n\t}`;

        modelContent += `\n\n} \n\nmodule.exports = new ${this.modelName}();`;
        this.modelContent = modelContent;
        return this;

    }

    /**
     * 
     * @param {FileSys} fs 
     */
    createOnFs(fs){

        const modelPath = `${__dirname}/business`;
        //console.log(modelPath);
        fs.writeFile(`${modelPath}/${this.modelName}.js`,this.modelContent, (err) => {

            console.log(`File was created`);
            console.log(`${err}`);

        });
        return this;

    }


    /** 
    * @param { DBInstance } dbInstance
    */
    async createTable(dbInstance){

        let queryString = `CREATE TABLE ${this.modelName || this.tableName}(\n`;
        queryString += `id SERIAL PRIMARY KEY, `;
        const fields = this.fields;

        for(let idx in fields){
            queryString += `\n\t${fields[idx]} VARCHAR(100),`;
        }

        queryString = `${queryString.substr(0,queryString.length - 1)}\n\n)`;
        await dbInstance.runQuery(queryString);

        console.log(`Create table called`);

        return this;

    }


    getModelFields(){

        const fields = this.fields;
        const dataTypes = this.fieldsType;


        return {
            value: () => {

                let fieldsName = ``;
        
                for(let idx in fields)
                    fieldsName += `'\${this.${fields[idx].field}}',`;
                return fieldsName.substr(0, fieldsName.length-1)+")";

            },
            name: () => {
                return fields.map(f => f.field ).join(",");
            },
            json: () => {

                const addFields = {
                                    "text": "keyword",
                                    "date": "keyword",
                                    "integer": "text",
                                    "double": "text"
                                };
                
                let jsonFields = {};
                for(let idx in fields){

                    if(fields[idx].field != undefined
                        && fields[idx].field != null
                        && fields[idx].field != ""){

                        let dataType = fields[idx].type;
                        jsonFields[fields[idx].field] = {
                            type: dataType, fields: {}
                        };
                        let addField = addFields[dataType];
                        jsonFields[fields[idx].field].fields[addField] = {type: addField};

                    }


                }
                return jsonFields;
            }
        };

    }

    nasteObject(name, values){
        console.log(`Adicionando o:`);
        console.log(values);
        this.jsonFields.mappings.properties[name] = {
            type: "nested",
            properties: values
        };
    }

    async createNastedObject({index}){
        index = indexNameExtract(index);
        await ES.createMapping({index, mappingObj: this.jsonFields});
    }

    generateSaveString(){

        let queryString = `\nINSERT INTO ${this.modelName || this.tableName} (fields) VALUES (`;
        const fields = this.fields;

        queryString += this.getModelFields().value();
        queryString = queryString.replace("(fields)",`(${this.getModelFields().name()})`);
        queryString += `\n;SELECT id FROM ${this.modelName || this.tableName} ORDER BY id DESC LIMIT 1;`

        return queryString;

    }


    generateFindString(){

        let queryString = `SELECT ${this.getModelFields().name()} FROM ${this.modelName || this.tableName}`;
        return queryString;

    }

    generateFindLastInsert(){

        let queryString = `SELECT id FROM ${this.modelName || this.tableName}`;
        return queryString;

    }


}



