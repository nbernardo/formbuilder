function postJSONRequest({ action, callback, content, nestedModels }) {

    const host = "localhost:#port";
    const url = `http://${host}/#url`;
    const xhr = new XMLHttpRequest();

    xhr.open("POST", `${url}/save`, true);
    xhr.setRequestHeader("Access-Control-Allow-Origin", "*");

    let newForm = new FormData();
    newForm.append("allField",JSON.stringify(content));
    
    if(Object.keys(nestedModels).length > 0)
        newForm.append("nestedModels",JSON.stringify(nestedModels));

    xhr.send(newForm);

    xhr.onload = function () {

        if (xhr.readyState == xhr.DONE) {
            callback(xhr.responseText);
            document.getElementById("spinningContainer").style.display = "none";
            document.getElementById("spinningCurtain").style.display = "none";
        }

    }

}

document.getElementById("spinningContainer").style.display = "none";
document.getElementById("spinningCurtain").style.display = "none";

function formSumit() {

    document.getElementById("spinningCurtain").style.display = "";
    document.getElementById("spinningContainer").style.display = "";
    let content = {};
    const fields = document.getElementsByClassName("databaseField");

    for (let idx in fields) {

        if (fields[idx].nodeName) {

            if (!fields[idx].classList.contains("notDataFieldConsider") && (fields[idx].nodeName.toLowerCase() == "input" || fields[idx].nodeName.toLowerCase() == "select")) {

                let curModel = fields[idx].dataset.model;
                let fieldName = fields[idx].name;
                let fieldValue = fields[idx].value;

                if (!content[curModel]) //Check if the Model Object isn't instantiated 
                    content[curModel] = {}

                if (fields[idx].name == "") {
                    fieldValue = fields[idx].value;
                    fieldName = fields[++idx].name;
                }


                if (!content[curModel][fieldName])
                    content[curModel][fieldName] = fieldValue;
            }
        }
    }
    
    parseNestedObject((nestedObject) => {

        postJSONRequest({ action: "save", callback: (res) => console.log(res), content, nestedModels });

    });

}


let nestedModels;
const parseNestedObject = function (callback) {

    nestedModels = {}

    let containers = document.getElementsByClassName("countDependentForm");
    let containersLst = Object.values(containers);
    const allFieldContainers = containersLst.filter(cmp => cmp.dataset.determinant != undefined && cmp.dataset.determinant != "");

    for (let idx in allFieldContainers) {

        let allFields = allFieldContainers[idx].getElementsByClassName("databaseField");
        allFields = Object.values(allFields);
        let newObject = {};

        if(!nestedModels[allFields[0].dataset.model])
            nestedModels[allFields[0].dataset.model] = [];

        for (let field of allFields) {

            if(!newObject[field.name])
                newObject[field.name] = field.value;

        }
        nestedModels[allFields[0].dataset.model].push(newObject);

    }

    callback(nestedModels);
}
