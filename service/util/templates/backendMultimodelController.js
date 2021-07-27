router.use(require("body-parser")());

//This content was generated from the template
router.post("/save", (req, client) => {

    const content = (req.body instanceof Object) ? req.body : JSON.parse(req.body);
    const sendModels = Object.keys(content);

    const listOfModels = [#models];
    let modelsMap = {};
    let fieldsValue = {};

    for(let model of listOfModels){
        modelsMap[model] = require(`../../models/business/${model}`);
    }

    for(let model in listOfModels){
        fieldsValue[model] = content[model];
    }

    const submittedModels = Object.keys(fieldsValue);
    for(let model in submittedModels){

        let fields = Object.keys(fieldsValue[model]);
        for(let field in fields){
            modelsMap[model][field] = fields[field];
        }

        modelsMap[model].save();

    }

    //for(let mode)


    // Replacing placeholder:  controllerName
    
    //const Model = require("../../models/business/#controllerName");
    //const content = (req.body instanceof Object) ? req.body : JSON.parse(req.body);
    //const fields = Object.keys(content);

    //for(let field of fields){
    //    Model[field] = content[field];
    //}

    //Model.save();
    //client.setHeader('Access-Control-Allow-Origin', '*');
    //client.send({msg: "Processo executado"});

});

module.exports = router;