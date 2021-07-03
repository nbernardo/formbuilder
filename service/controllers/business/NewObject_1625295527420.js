const express = require('express');

const router = express.Router();




        router.use(require("body-parser")());

        router.post("/save", (req, client) => {

            const Model = require("../../models/business/NewObject_1625295527420");
            const content = (req.body instanceof Object) ? req.body : JSON.parse(req.body);
            const fields = Object.keys(content);
        
            for(let field of fields){
                Model[field] = content[field];
            }

            Model.save();
            client.setHeader('Access-Control-Allow-Origin', '*');
            client.send({msg: "Processo executado"});
        
        });

        module.exports = router;
        