//const express = require('express');
//const router = express.Router();

class ViewControllerGenerator {

    static newController(fs, endpoint, method) {

        console.log(`Novo controller`);
        let jsonRequest = fs.readFileSync(`./util/templates/postJSONRequest.js`,'utf8');
        console.log(`File content:`);
        const PORT = process.env.PORT | 5000;
    
        /**
         * Replacing place holder:
         * #url, #action, #port
         */
        let requestMethods = jsonRequest
                                .replace("#url",`${endpoint}`)
                                .replace("#action",`${method}`)
                                .replace("#port",PORT);
    
        console.log(requestMethods);

        return requestMethods;


    }

    static newBackController(fs){

        let backendControllerContent = fs.readFileSync(`./util/templates/backendController.js`,'utf8');
        return `${backendControllerContent}`;

    }

}

module.exports = ViewControllerGenerator;