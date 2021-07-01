const express = require("express");
const app = express();
const cors = require("cors");
const fs = require("fs");
const xmlBeauty = require("xml-beautifier");
const ModelGenerator = require("./models/ModelGenerator");
const PostgresInstance = require("./models/PostgresInstance");


const PORT = process.env.PORT | 5000;

//app.use(require("body-parser")());
//app.use(express.urlencoded());
app.use(cors({ origin: "*" }));
app.use(require("multer")().array());

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


    return;
    fs.writeFile('form1.xml', formContent, (err) => {

        console.log(`Executou a criacao do ficheiro: `, err);
        client.send("Process done!");

    });


})