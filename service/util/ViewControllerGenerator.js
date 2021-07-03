//const express = require('express');
//const router = express.Router();

class ViewControllerGenerator {

    static newController(fs, endpoint, method) {

        console.log(`Novo controller`);
        let jsonRequest = fs.readFileSync(`./util/postJSONRequest.js`,'utf8');
        console.log(`File content:`);
        const PORT = process.env.PORT | 5000;
    
        let requestMethods = jsonRequest
                                .replace("#url",`${endpoint}`)
                                .replace("#action",`${method}`)
                                .replace("#port",PORT);
    
        console.log(requestMethods);

        return requestMethods;

        //this.controllerContent = saveAlgoritm;
        //return this;

    }

}

module.exports = ViewControllerGenerator;