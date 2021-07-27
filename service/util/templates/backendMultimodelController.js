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

        let fields = content[model];
        for(let field in fields){
            modelsMap[model][field] = fields[field];
        }

        modelsMap[model].save();

    }

});

module.exports = router;