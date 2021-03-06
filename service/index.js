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

app.post("/newForm", (req, client) => {

    const formContent = req.body;
    //const beautyFormContent = xmlBeauty(formContent);
    const databaseFields = Object.keys(JSON.parse(formContent.databaseFields));
    console.log(databaseFields);
    client.send("Process done!");

    formContent.entityName = `MaisUmModel`;
    const objectName = formContent.entityName || `NewObject_${(new Date).getTime()}`;

    const modelGenerator = new ModelGenerator(objectName);
    modelGenerator.fields = databaseFields;
    modelGenerator
        .newModel()
        .createOnFs(fs)
        .createTable(PostgresInstance);

    const controllerGenerator = new ControllerGenerator(objectName);
    controllerGenerator
        .newController(fs)
        .createOnFs();

    //Import the new generated controller
    const stream = fs.createWriteStream("index.js",{flags: "a"});
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
        client.send({files});
   })

})

const MaisUmModelController = require("./controllers/business/MaisUmModel");
app.use("/maisummodel",MaisUmModelController);