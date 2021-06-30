const express = require("express");
const app = express();
const cors = require("cors");
const fs = require("fs");
const xmlBeauty = require("xml-beautifier");

const PORT = process.env.PORT | 5000;

//app.use(require("body-parser")());
//app.use(express.urlencoded());
app.use(cors({origin: "*"}));
app.use(require("multer")().array());

app.listen(PORT, () => console.log(`Servico rodando em ${PORT}`));


app.post("/newForm", (req, client) => {

    const formContent = req.body.formContent;
    const beautyFormContent = xmlBeauty(formContent);

    fs.writeFile('form1.xml',formContent, (err) => {
        
        console.log(`Executou a criacao do ficheiro: `, err);
        client.send("Process done!");
        
    });


})