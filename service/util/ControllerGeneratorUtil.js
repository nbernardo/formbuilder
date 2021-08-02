//const express = require('express');
//const router = express.Router();

class ViewControllerGenerator {

    static newController(fs, endpoint, method, wizard = false) {

        let jsonRequest = fs.readFileSync(`./util/templates/postJSONRequest.js`,'utf8');
        const PORT = process.env.PORT | 5000;
        
        /**
         * Replacing place holder:
         * #url, #action, #port
         */
        let requestMethods = jsonRequest
        .replace("#url",`${endpoint}`)
        .replace("#action",`${method}`)
        .replace("#port",PORT);
        
        //console.log(requestMethods);
        if(wizard){
            let wizardScript = fs.readFileSync(`./util/templates/wizardNavigation.js`,'utf8');
            requestMethods += `\n\n${wizardScript}`;
        }

        return requestMethods;
        

    }

    static newBackController(fs){

        //let backendControllerContent = fs.readFileSync(`./util/templates/backendController.js`,'utf8');
        let backendControllerContent = fs.readFileSync(`./util/templates/backendMultimodelController.js`,'utf8');
        return `${backendControllerContent}`;

    }

}

module.exports = ViewControllerGenerator;