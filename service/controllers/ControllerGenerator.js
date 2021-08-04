//const express = require('express');
//const router = express.Router();

const FileSys = require('../models/interfaces/FileSystem');
const ViewControllerGenerator = require('../util/ControllerGeneratorUtil');

class ControllerGenerator {

    controllerContent;
    controllerName = null;
    fileSystem = null;
    modelList = [];
    generationExcetion = false;

    constructor(name){
        this.controllerName = name;
    }

    setupRouter() {

        let corsContent = `const cors = require("cors");\nrouter.use(cors({ origin: "*" }));\n`;
        corsContent = "";
        return `const express = require('express');\n\nconst router = express.Router();\n${corsContent}`;

    }

    /**
    * @param {FileSys} fs 
    */
    newController(fs) {

        this.fileSystem = fs;
        let controllerRouter = `${this.setupRouter()}\n\n`;
        let controllerContent = ViewControllerGenerator.newBackController(fs);

        if(this.modelList.length > 0){

            const allModels = '"'+this.modelList.join(`","`)+'"';
            this.controllerContent = `${controllerRouter}${controllerContent.replace("#models",allModels)}`;  
            //console.log(`Multi models`);
            //console.log(allModels);

        }
        //console.log(`Controller content: `);
        //console.log(controllerContent);

        //controllerContent = controllerContent.replace("#controllerName",this.controllerName);
        //this.controllerContent = `${controllerRouter}${controllerContent.replace("#controllerName",this.controllerName)}`;

        return this;

    }


    /**
    * @param {FileSys} fs 
    */
    async createOnFs(fs = null) {
        
        const controllerPath = `${__dirname}/business`;
        console.log(controllerPath);
        this.fileSystem.writeFileSync(`${controllerPath}/${this.controllerName}.js`, this.controllerContent, (err) => {

            if(err){
                this.generationExcetion = true;
            }
            console.log(`Controller was created`);
            console.log(`${err}`);

        });
        return this;

    }

    importController(){

        let controllerName = `${this.controllerName}Controller`;
        let controllerContent = `\n\nconst ${controllerName} = require("./controllers/business/${this.controllerName}");\napp.use("${this.getBaseEndpoint()}",${controllerName});`;
        return controllerContent;
    }

    getBaseEndpoint(){

        let endpointName = this.controllerName.toString().toLowerCase();
        return `/${endpointName}`;

    }

}

module.exports = ControllerGenerator;