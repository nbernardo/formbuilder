function postJSONRequest({ action, callback, content }) {

    const host = "localhost:#port";
    const url = `http://${host}/#url`;
    const xhr = new XMLHttpRequest();

    xhr.open("POST", `${url}/#action`, true);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
    xhr.send(JSON.stringify(content));

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


                if (!content[curModel][fieldName]) {
                    content[curModel][fieldName] = fieldValue;

                }

            }
        }

    }

    postJSONRequest({ action: "save", callback: (res) => console.log(res), content });

}
