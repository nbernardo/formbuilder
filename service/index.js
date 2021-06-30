const express = require("express");
const app = express();
const cors = require("cors");
const fs = require("fs");
const xmlBeauty = require("xml-beautifier");

const { Pool } = require("pg");

const pool = new Pool({
    connectionString: `postgres://postgres:1234@localhost:5432/geocad_poc_alt`
});

async function db() {

    const client = await pool.connect();
    const query = await client.query("SELECT NOW()");

    const queryString = `
        CREATE TABLE novaTest(
            id int,
            nome char(80)
        )
    `;

    await client.query(queryString);

    //console.log(`Correu`);
    //console.log(query.rows);

    

}

db()

const PORT = process.env.PORT | 5000;

//app.use(require("body-parser")());
//app.use(express.urlencoded());
app.use(cors({ origin: "*" }));
app.use(require("multer")().array());

app.listen(PORT, () => console.log(`Servico rodando em ${PORT}`));


app.post("/newForm", (req, client) => {

    const formContent = req.body;
    //const beautyFormContent = xmlBeauty(formContent);
    const databaseFields = Object.keys(formContent.databaseFields);
    console.log(databaseFields);
    client.send("Process done!");

    return;
    fs.writeFile('form1.xml', formContent, (err) => {

        console.log(`Executou a criacao do ficheiro: `, err);
        client.send("Process done!");

    });


})