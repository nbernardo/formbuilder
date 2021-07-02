const FileSys = require('./interfaces/FileSystem');
const DBInstance = require("./interfaces/DBInstance");

module.exports = class ModelGenerator {

    fields = [];
    modelContent = null;
    tableName;
    modelName = null;

    constructor(name){
        this.modelName = name;
    }

    newModel() {

        const number = (new Date()).getTime();
        this.tableName = `newTable_${number}`;

        let fields = this.fields;
        
        let modelContent = `const PostgresInstance = require("../PostgresInstance");\n\nclass ${this.modelName}{\n`;

        for (let idx in fields) {
            modelContent += `\n\t${fields[idx]};`;
            console.log(`Na linha ${idx}: ${modelContent}`);
        }

        const saveString = this.generateSaveString();
        modelContent += `\n\n\tsave(){\n\t\tPostgresInstance.runQuery(\`${saveString}\`);\n\t}`;

        const findString = this.generateFindString();
        modelContent += `\n\n\tfind(){\n\t\tPostgresInstance.runQuery(\`${findString}\`);\n\t}`;

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
        console.log(modelPath);
        fs.writeFile(`${modelPath}/${this.modelName}.js`,this.modelContent, (err) => {

            console.log(`File was created`);
            console.log(`${err}`);

        });
        return this;

    }


    /** 
    * @param { DBInstance } dbInstance
    */
    createTable(dbInstance){

        let queryString = `CREATE TABLE ${this.tableName}(\n`;
        const fields = this.fields;

        for(let idx in fields){
            queryString += `\n\t${fields[idx]} VARCHAR(100),`;
        }

        queryString = `${queryString.substr(0,queryString.length - 1)}\n\n)`;
        dbInstance.runQuery(queryString);

        return this;

    }


    getModelFields(){

        const fields = this.fields;

        return {
            value: () => {

                let fieldsName = ``;
        
                for(let idx in fields)
                    fieldsName += `'\${this.${fields[idx]}}',`;
                return fieldsName.substr(0, fieldsName.length-1)+")";

            },
            name: (queryString) => {
                return fields.join(",");
            }
        };

    }

    generateSaveString(){

        let queryString = `INSERT INTO ${this.tableName} (fields) VALUES (`;
        const fields = this.fields;

        queryString += this.getModelFields().value();
        queryString = queryString.replace("(fields)",`(${this.getModelFields().name()})`);

        return queryString;

    }


    generateFindString(){

        let queryString = `SELECT ${this.getModelFields().name()} FROM ${this.tableName}`;
        return queryString;

    }


}



