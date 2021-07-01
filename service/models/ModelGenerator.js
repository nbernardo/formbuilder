const FileSys = require('./FileSystem');

module.exports = class ModelGenerator {

    fields = [];
    modelContent = null;

    newModel() {

        let fields = this.fields;
        let modelContent = `class NovoClass{\n`;

        for (let idx in fields) {
            modelContent += `\n\t${fields[idx]};`;
            console.log(`Na linha ${idx}: ${modelContent}`);
        }

        modelContent += `\n\n}`;
        this.modelContent = modelContent;
        return this;

    }

    /**
     * 
     * @param {FileSys} fs 
     */
    createOnFs(fs){

        const modelPath = `${__dirname}/business`;
        console.log(modelPath);
        fs.writeFile(`${modelPath}/Nova.js`,this.modelContent, (err) => {

            console.log(`File was created`);
            console.log(err);

        })

    }

}



