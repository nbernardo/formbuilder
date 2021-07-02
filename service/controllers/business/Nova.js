const express = require('express');

const router = express.Router();


        router.post("/save", (req, client) => {

            const Model = require("../../models/business/Nova");
            const content = (req.body instanceof Object) ? req.body : JSON.parse(req.body);
            const fields = Object.keys(content);
        
            for(let field of fields){
                Model[field] = content[field];
            }

            Model.save();
            client.send({msg: "Processo executado"});
        
        });

        module.exports = router;
        