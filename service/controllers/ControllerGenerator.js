//const express = require('express');
//const router = express.Router();
const FileSys = require('../models/interfaces/FileSystem');

class ControllerGenerator {

    controllerContent;
    controllerName = null;

    constructor(name){
        this.controllerName = name;
    }

    setupRouter() {

        return `const express = require('express');\n\nconst router = express.Router();`;

    }

    newController() {

        let saveAlgoritm = `${this.setupRouter()}\n\n`;
        saveAlgoritm += `
        router.post("/save", (req, client) => {

            const Model = require("../../models/business/${this.controllerName}");
            const content = (req.body instanceof Object) ? req.body : JSON.parse(req.body);
            const fields = Object.keys(content);
        
            for(let field of fields){
                Model[field] = content[field];
            }

            Model.save();
            client.send({msg: "Processo executado"});
        
        });

        module.exports = router;
        `;

        this.controllerContent = saveAlgoritm;
        return this;

    }


    /**
    * @param {FileSys} fs 
    */
    createOnFs(fs) {

        const controllerPath = `${__dirname}/business`;
        console.log(controllerPath);
        fs.writeFile(`${controllerPath}/${this.controllerName}.js`, this.controllerContent, (err) => {

            console.log(`Controller was created`);
            console.log(`${err}`);

        });
        return this;

    }

    importController(){

        let controllerName = `${this.controllerName}Controller`;
        let endpointName = this.controllerName.toString().toLowerCase();
        let controllerContent = `\n\nconst ${controllerName} = require("./controllers/business/${this.controllerName}");\napp.use("/${endpointName}",${controllerName});`;
        return controllerContent;
    }

}

module.exports = ControllerGenerator;