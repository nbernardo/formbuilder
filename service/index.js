const express = require("express");
const app = express();
const cors = require("cors");
const fs = require("fs");
const xmlBeauty = require("xml-beautifier");
const ModelGenerator = require("./models/ModelGenerator");
const ControllerGenerator = require("./controllers/ControllerGenerator");
const ViewControllerGenerator = require("./util/ControllerGeneratorUtil");
const MySQLInstance = require("./models/dbconnection/MySQLInstance");


const PORT = process.env.PORT | 5000;

//app.use(express.urlencoded());
app.use(cors({ origin: "*" }));

app.use(require("multer")().array());
app.use(require("body-parser")());

app.listen(PORT, () => console.log(`Servico rodando em ${PORT}`));

/**
 * @param {Array} fields 
 */
const parseFieldAndModels = function (fields, types, defaultModel = "MainModel") {

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
            fieldsAndModels[curModel].push({ field: curField, type: types[x] });

        }

        curModel = defaultModel;

    }

    //console.log(`All fields:`);
    //console.log(fieldsAndModels);

    return fieldsAndModels;

}

const generateSQLModels = async function (databaseFields) {

    const modelsAndFields = parseFieldAndModels(databaseFields);
    const models = Object.keys(modelsAndFields);
    const foreignModel = models[0];

    for (modelName of models) {

        const modelGenerator = new ModelGenerator(modelName);
        modelGenerator.fields = modelsAndFields[modelName];
        modelGenerator.foreignModel = foreignModel;
        modelGenerator
            .newModel()
            .createOnFs(fs);
        await modelGenerator.createTable(MySQLInstance);

    }
    return models;

}

const generateJSONModels = async function (databaseFields, fieldsType, formName) {

    const modelsAndFields = parseFieldAndModels(databaseFields, fieldsType);
    const models = Object.keys(modelsAndFields);
    const foreignModel = models[0];
    let firstModel = null;

    for (modelName of models) {

        const modelGenerator = new ModelGenerator(modelName);
        modelGenerator.fields = modelsAndFields[modelName];
        modelGenerator.foreignModel = foreignModel;
        modelGenerator
            .newModel()
            .createOnFs(fs);

        if (modelName == foreignModel)
            firstModel = modelGenerator;


        if (modelName != "MainModel")
            firstModel.nasteObject(modelName, modelGenerator.getModelFields().json());

    }
    firstModel.createNastedObject({ index: formName });
    return models

}

app.post("/newForm", async (req, client) => {

    const formContent = req.body;
    const databaseFields = Object.keys(JSON.parse(formContent.databaseFields));
    const formName = formContent.statedFormName;
    const fieldsType = Object.values(JSON.parse(formContent.fieldTypes));

    //const modelList = await generateSQLModels(databaseFields);
    const jsonModels = await generateJSONModels(databaseFields, fieldsType, formName);
    //console.log(`A model was generated:`);
    //console.log(`Do retorno:`);
    console.log(jsonModels);


    formContent.entityName = formName;
    const objectName = formContent.entityName || `NewObject_${(new Date).getTime()}`;

    const controllerGenerator = new ControllerGenerator(objectName);
    controllerGenerator.modelList = jsonModels;
    controllerGenerator
        .newController(fs)
        .createOnFs()
        .then(async (r) => {

            if (controllerGenerator.generationExcetion) {
                client.send({ ok: false });
                return;
            }

            //Import the new generated controller
            const stream = fs.createWriteStream("index.js", { flags: "a" });
            stream.once('open', (fd) => {

                stream.write(controllerGenerator.importController());

                //Generate  the funcions to call the service from the view
                const baseEndpoint = controllerGenerator.getBaseEndpoint().substr(1);
                const viewController = ViewControllerGenerator.newController(fs, baseEndpoint, "save", formContent.linkedForms);
                const viewControllerContent = `<script>\n\n${viewController}\n\n</script>`;
                const cssContent = `<link href="../assets/css/main.css" rel="stylesheet" />
                                    <link href="../assets/css/spinner.css" rel="stylesheet" />`;

                //Generate the view itself
                const frontEndPath = `${__dirname}/../frontend`;
                let viewContent = `${cssContent}\n\n${formContent.formContent}\n\n${viewControllerContent}`;

                fs.writeFile(`${frontEndPath}/${objectName}.html`, viewContent, (err) => {

                    console.log(`Executou a criacao do ficheiro: `, err);
                    if (err) {
                        client.send({ ok: false });
                        return;
                    }
                    fs.writeFileSync(`${frontEndPath}/templates/${objectName}.html`, viewContent);
                    client.send({ ok: true });

                });

            });

        });


})


app.get("/form-list", (req, client) => {

    fs.readdir("../frontend", (err, files) => {
        client.send({ files });
    })

})

const concecionariaController = require("./controllers/business/concecionaria");
app.use("/concecionaria",concecionariaController);