function postJSONRequest({ action, callback, content }) {

    const host = "localhost:#port";
    const url = `http://${host}/#url`;
    const xhr = new XMLHttpRequest();

    xhr.open("POST", `${url}/#action`, true);
    xhr.setRequestHeader("Content-type","application/json");
    xhr.setRequestHeader("Access-Control-Allow-Origin","*");
    xhr.send(JSON.stringify(content));

    xhr.onload = function () {

        if (xhr.readyState == xhr.DONE) {
            callback(xhr.responseText);
        }

    }
    
}

function formSumit(){

    let content = {};
    const fields = document.getElementsByClassName("databaseField");
    for(let idx in fields) 
        if (fields[idx].nodeName)
            if (fields[idx].name != "" && (fields[idx].nodeName.toLowerCase() == "input" || fields[idx].nodeName.toLowerCase() == "select"))
                content[fields[idx].name] = fields[idx].value;

    console.log(`Data to send:`);
    console.log(content);

    postJSONRequest({action: "save", callback: (res) => console.log(res), content });

}