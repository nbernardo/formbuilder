const express = require("express");
const app = express();
const cors = require("cors");
const fs = require("fs");
const xmlBeauty = require("xml-beautifier");
const ModelGenerator = require("./models/ModelGenerator");
const ControllerGenerator = require("./controllers/ControllerGenerator");
const ViewControllerGenerator = require("./util/ControllerGeneratorUtil");
const PostgresInstance = require("./models/PostgresInstance");


const PORT = process.env.PORT | 5000;

//app.use(express.urlencoded());
app.use(cors({ origin: "*" }));

app.use(require("multer")().array());
app.use(require("body-parser")());

app.listen(PORT, () => console.log(`Servico rodando em ${PORT}`));

/**
 * @param {Array} fields 
 */
const parseFieldAndModels = function (fields, defaultModel = "MainModel") {

    fieldsAndModels = {};

    let curModel;
    let curField;

    for (let x = 0; x < fields.length; x++) {

        curField = fields[x];
        if (fields[x].indexOf(".") >= 0) {

            curModel = fields[x].split(".")[0];
            curField = fields[x].split(".")[1];

        }

        if (curModel) {

            if (!fieldsAndModels[curModel]) fieldsAndModels[curModel] = [];
            fieldsAndModels[curModel].push(curField);

        }

        curModel = defaultModel;

    }

    console.log(`All fields:`);
    console.log(fieldsAndModels);

    return fieldsAndModels;

}

const generateModels = function (databaseFields) {

    const modelsAndFields = parseFieldAndModels(databaseFields);
    const models = Object.keys(modelsAndFields);
    const foreignModel = models[0];

    for (modelName of models) {

        const modelGenerator = new ModelGenerator(modelName);
        modelGenerator.fields = modelsAndFields[modelName];
        modelGenerator.foreignModel = foreignModel;
        modelGenerator
            .newModel()
            .createOnFs(fs)
            .createTable(PostgresInstance);

    }

    return models;

}

app.post("/newForm", (req, client) => {

    const formContent = req.body;
    console.log(`Conteudo enviado`);
    console.log(formContent);
    //const beautyFormContent = xmlBeauty(formContent);
    const databaseFields = Object.keys(JSON.parse(formContent.databaseFields));
    const formName = formContent.statedFormName;
    console.log(`Campos achados`);
    console.log(databaseFields);
    client.send("Process done!");

    const modelList = generateModels(databaseFields);

    formContent.entityName = formName;
    const objectName = formContent.entityName || `NewObject_${(new Date).getTime()}`;

    const controllerGenerator = new ControllerGenerator(objectName);
    controllerGenerator.modelList = modelList;
    controllerGenerator
        .newController(fs)
        .createOnFs();


    //Import the new generated controller
    const stream = fs.createWriteStream("index.js", { flags: "a" });
    stream.once('open', (fd) => {
        stream.write(controllerGenerator.importController());
    });

    //Generate  the funcions to call the service from the view
    const baseEndpoint = controllerGenerator.getBaseEndpoint().substr(1);
    const viewController = ViewControllerGenerator.newController(fs, baseEndpoint, "save");
    const viewControllerContent = `<script>\n\n${viewController}\n\n</script>`;
    const cssContent = `<link href="../assets/css/main.css" rel="stylesheet" />`;

    //Generate the view itself
    const frontEndPath = `${__dirname}/../frontend`;
    let viewContent = `${cssContent}\n\n${formContent.formContent}\n\n${viewControllerContent}`;

    fs.writeFile(`${frontEndPath}/${objectName}.html`, viewContent, (err) => {
        console.log(`Executou a criacao do ficheiro: `, err);
    });

})


app.get("/form-list", (req, client) => {

    fs.readdir("../frontend", (err, files) => {
        client.send({ files });
    })

})

const CorrenteFormController = require("./controllers/business/CorrenteForm");
app.use("/correnteform",CorrenteFormController);