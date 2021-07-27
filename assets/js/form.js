const CLOSEBTN = `<br><span class="closePreview btnAbb" onclick="closePreview()">X</span><br><br>`;
const SAVEBTN = `<input id="statedFormName" size="100"><button onclick="saveForm()" id="formSaveButton" type="button">Salvar Formulário</button><br>`;


function closePreview() {

    let previewContainer = document.getElementById("previewFormContainer");
    document.body.removeChild(previewContainer);

}


const previewForm = function () {

    let onCreationForm = document.getElementById("formArea").innerHTML;
    let previewContainer = document.createElement("div");
    previewContainer.id = "previewFormContainer";
    previewContainer.style.display = "none";

    const actions = `${CLOSEBTN}${SAVEBTN}`;

    document.body.appendChild(previewContainer);
    document.getElementById("previewFormContainer").innerHTML = `${actions}${onCreationForm}`;

    setTimeout(() => {

        const context = document.getElementById("previewFormContainer");
        removeNewOptionContainer(context);
        removeRemoveComponent(context);
        resetLabelPos(context);
        resetFormLines(context);
        resetSelectPos(context);
        removeConfigButtons(context);
        resetOptionGroupContainer(context);
        removeConfigContnent(context);
        document.getElementById("previewFormContainer").style.display = "";

    }, 500);

}

const sendForm = function (content, fields = "") {

    const SERVER = "http://localhost:5000";
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${SERVER}/newForm`, true);

    const form = new FormData();
    form.append("formContent", content);
    form.append("databaseFields", JSON.stringify(fields));
    form.append("statedFormName", document.getElementById("statedFormName").value);

    xhr.send(form);

    xhr.onloadend = function () {

        if (xhr.readyState == 4) {
            console.log(`Resultado e: `);
            console.log(xhr.responseText);
        }

    }

}

const saveForm = function () {

    const ctx = document.getElementById("previewFormContainer");
    const databaseFieldList = ctx.getElementsByClassName("databaseField");
    let allDatabaseField = {};

    for (let field in databaseFieldList) {
        let curField = databaseFieldList[field];
        console.log(`Existing field: ${curField}`);
        //let modelName = curField.dataset.model ? `${curField.dataset.model}.` : "";
        //let modelName = "";

        if (curField.nodeName) {

            if (curField.name != "" && (curField.nodeName.toLowerCase() == "input" || curField.nodeName.toLowerCase() == "select")) {
                let modelName = curField.dataset.model ? `${curField.dataset.model}.` : "";
                if (!Object.keys(allDatabaseField).includes(`${modelName}${curField.name}`))
                    allDatabaseField[`${modelName}${curField.name}`] = "";
            }
        }

    }

    const formContent = document.getElementById("previewFormContainer").innerHTML;
    let realForm = formContent.replace(CLOSEBTN, "").replace(SAVEBTN, "");
    realForm += `<button onclick='formSumit()'>Guardar</button>`;

    console.log(`Campos encontrados:`);
    console.log(allDatabaseField);

    sendForm(realForm, allDatabaseField);

}


function removeNewOptionContainer(ctx) {

    let allContainers = ctx.getElementsByClassName("newOptionContainer");
    for (let idx = 0; idx < allContainers.length; idx++) {
        allContainers[idx].style.display = "none";
    }

}

function removeConfigButtons(ctx) {

    let allConfigs = ctx.getElementsByClassName("inputComponentIcon");
    for (let idx = 0; idx < allConfigs.length; idx++) {
        allConfigs[idx].style.display = "none";
    }

}

function removeRemoveComponent(ctx) {

    let allContainers = ctx.getElementsByClassName("removeComponent");
    for (let idx = 0; idx < allContainers.length; idx++) {
        allContainers[idx].style.display = "none";
        allContainers[idx].style.border = "none";
    }

}

function resetLabelPos(ctx) {

    let allContainers = ctx.getElementsByClassName("formInputLabel");
    for (let idx = 0; idx < allContainers.length; idx++) {
        allContainers[idx].classList.remove("paddingLeft10px");
        allContainers[idx].contentEditable = false;
    }

}

function removeConfigContnent(ctx){

    /*
    let allConfigs = ctx.getElementsByClassName("inputConfigPanel");

    for (let idx = 0; idx < allConfigs.length; idx++) {
        allConfigs[idx].parentNode.removeChild(allConfigs[idx]);
    }
    */

}

function resetFormLines(ctx) {

    let allContainers = ctx.getElementsByClassName("formNewLine");
    for (let idx = 0; idx < allContainers.length; idx++) {
        allContainers[idx].style.minHeight = "45px";
        allContainers[idx].style.marginTop = "5px";
    }

}

function resetSelectPos(ctx) {

    let allSelects = ctx.getElementsByClassName("selectComponent");
    for (let idx = 0; idx < allSelects.length; idx++) {
        allSelects[idx].style.marginTop = "-2px";
    }

}


function resetOptionGroupContainer(ctx) {

    try {

        return;
        ctx
            .getElementsByClassName("optionGroupContainer")[0]
            .getElementsByTagName("span")[0]
            .classList.remove("left5px");

    } catch (error) { }

}


function newModel() {

    const componentId = `modelInputId${(new Date()).getTime()}`;

    console.log(`Chamou no inicio`);
    const container = document.getElementById("formConfigurationPanel");
    const modelsList = container.getElementsByClassName("modelPannel")[0];

    const modelIcon = document.createElement("img");
    modelIcon.src = "assets/icons/data_model.png";
    modelIcon.className = "inputComponentIcon";

    const modelName = document.createElement("input");
    modelName.onblur = function (event) {

        console.log(`Adicionando novo dados`);
        const text = event.target.value;
        if (text != "")
            addNewModel({ val: text, id: event.target.id });
        console.log(`Novo daddo adicionado`);

    }

    modelName.id = componentId;
    modelName.style.marginLeft = "7px";
    modelName.style.marginTop = "3px";
    modelName.style.width = "130px";
    modelName.style.border = "none";
    modelName.placeholder = `Nome Entidade`;

    const modelLine = document.createElement("li");
    modelLine.style.display = "flex";
    modelLine.style.borderRadius = "3px";
    modelLine.style.border = "1px solid grey";
    modelLine.style.padding = "5px";
    modelLine.appendChild(modelIcon);
    modelLine.appendChild(modelName);

    modelsList.appendChild(modelLine);

    console.log(`Chamou no fim`);

}

const modelsNameLista = {};
function addNewModel({ val, id }) {

    const modelLists = document.getElementsByClassName("fieldGroupModel");
    modelsNameLista[id] = val;

    let component = `
        <select class="editing_tabel" onchange="setFieldsModelName(event)" id="entityName${id}">
            <option class="editing_tabel" value="">Selecione a entidade</option>
    `;

    const options = Object.keys(modelsNameLista);
    for (let x = 0; x < options.length; x++) {
        let value = modelsNameLista[options[x]];
        component += `<option class="editing_tabel" value="${value}">${value}</option>`;
    }

    component += `</select>`;

    for (let x = 0; x < modelLists.length; x++) {

        modelLists[x].innerHTML = component;

    }


}