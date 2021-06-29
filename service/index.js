const express = require("express");
const app = express();

const PORT = process.env.PORT | 5000;


//app.use(require("body-parser")());
//app.use(express.urlencoded());
app.use(require("multer")().array())

app.listen(PORT, () => console.log(`Servico rodando em ${PORT}`));


app.post("/newForm", (req, client) => {

    console.log(`Receivedd request is: `);
    console.log(req.body.nome);

    client.send("Process done!");

})