router.use(require("body-parser")());

//This content was generated from the template
router.post("/save", async (req, client) => {

    const content = (req.body instanceof Object) ? req.body : JSON.parse(req.body);
    const sendModels = Object.keys(content);

    const listOfModels = [#models];
    let modelsMap = {};
    let processedModel = 0;
    let primaryModelId = null;
    let insertedValue = null;

    for(let model of listOfModels){
        
        modelsMap[model] = require(`../../models/business/${model}`);

        let fields = content[model];
        for(let field in fields){
            modelsMap[model][field] = fields[field];
        }

        insertedValue = await modelsMap[model].save();
        if(processedModel == 0){
            primaryModelId = insertedValue[1].rows[0].id;
        }
        processedModel++;

    }

});

module.exports = router;