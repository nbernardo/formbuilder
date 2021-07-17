router.use(require("body-parser")());

//This content was generated from the template
router.post("/save", (req, client) => {

    // Replacing placeholder:  controllerName
    const Model = require("../../models/business/#controllerName");
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