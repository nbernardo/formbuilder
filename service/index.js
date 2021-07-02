const express = require("express");
const app = express();
const cors = require("cors");
const fs = require("fs");
const xmlBeauty = require("xml-beautifier");
const ModelGenerator = require("./models/ModelGenerator");
const ControllerGenerator = require("./controllers/ControllerGenerator");
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

    const modelGenerator = new ModelGenerator();
    modelGenerator.fields = databaseFields;
    modelGenerator
        .newModel()
        .createOnFs(fs)
        .createTable(PostgresInstance);

    const controllerGenerator = new ControllerGenerator();
    controllerGenerator
        .newController()
        .createOnFs(fs);

    const stream = fs.createWriteStream("index.js",{flags: "a"});
    stream.once('open', (fd) => {
        stream.write(controllerGenerator.importController());
    })


    return;
    const frontEndPath = `${__dirname}/../frontend`;

    fs.writeFile(`${frontEndPath}/form1.xml`, formContent.formContent, (err) => {

        console.log(`Executou a criacao do ficheiro: `, err);

    });

})
const controller = require("./controllers/business/Nova");
app.use("/novo",controller);