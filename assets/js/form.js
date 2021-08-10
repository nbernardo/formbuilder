const CLOSEBTN = `<br><span class="closePreview btnAbb" onclick="closePreview()">X</span><br><br>`;
const SAVEBTN = `<input id="statedFormName" size="50"><button onclick="saveForm()" id="formSaveButton" type="button">Salvar Formulário</button><br>`;
const FormBucket = {};
const FormVariables = {
    counter: 1,
    activeForm: null
}

const createLinkedForm = function () {

    if (isFormAreaEmpty()) {
        alert("N\ao existe um form anterior para linkar com o novo");
        return;
    }

    let curForm = document.getElementById("formArea").innerHTML;
    curForm = curForm.indexOf("<contentinit>") >= 0 ? curForm.split("<contentinit>")[1] : curForm;

    document.getElementById("formArea").innerHTML = "";

    let determinandField = document.getElementById("formDeterminanteList").value;
    const dependingField = determinandField = "" ? "" : `class="countDependentForm" data-determinant=${determinandField}`;
    let startTag = `<span ${dependingField}>`;
    let endTag = `</span>`;

    addNewForm(`${startTag}<contentinit>${curForm}${endTag}`);


}


const addNewForm = function (content) {

    if (FormVariables.activeForm) {
        FormBucket[FormVariables.activeForm] = content;
        FormVariables.activeForm = null;
        return;
    }

    const formId = (Object.keys(FormBucket).length + 1);
    FormBucket[formId] = content;

    const newFormLineItem = document.createElement("li");
    newFormLineItem.className = "addFormLine";
    newFormLineItem.style.cursor = "pointer";
    newFormLineItem.style.marginLeft = "15px";
    newFormLineItem.style.textDecoration = "underline";
    newFormLineItem.innerHTML = `${formId}º Form`;

    newFormLineItem.onclick = function (event) {

        removeBolfFromLineForm();
        document.getElementById("formArea").style.display = "none";
        document.getElementById("spinningContent").style.display = "flex";
        document.getElementById("formArea").innerHTML = FormBucket[formId];

        setTimeout(() => resetBuilderFeatures(), 1000);
        FormVariables.activeForm = formId;
        event.target.style.fontWeight = "bold";
        event.target.style.background = "#cdec9e";
        event.target.style.borderRadius = "3px";
        event.target.style.width = "60px";

    }

    document.getElementById("creatingForms").appendChild(newFormLineItem);

}

const removeBolfFromLineForm = function () {
    const compoenents = document.getElementsByClassName("addFormLine");
    for (let x = 0; x < compoenents.length; x++) {
        compoenents[x].style.fontWeight = "normal";
        compoenents[x].style.background = "none";
    }
}

const resetBuilderFeatures = function () {
    resetRemoveComponent();
    resetRemoveLine();
    resetComboBoxAddItem();
    resetLineDragEvent();
    resetAllModelNameInputs(restateAllModels);
}

const resetRemoveComponent = function () {

    const components = document.getElementsByClassName("componentRemover");
    for (let x = 0; x < components.length; x++)
        components[x].addEventListener('click', event => removeComponent(event));

}

const resetRemoveLine = function () {

    const components = document.getElementsByClassName("lineRemover");
    for (let x = 0; x < components.length; x++)
        components[x].addEventListener('click', event => removeLine(event.target.dataset.lineId, event.target));

}

const resetComboBoxAddItem = function () {

    const components = document.getElementsByClassName("addComboOption");
    for (let x = 0; x < components.length; x++)
        components[x].addEventListener('click', event => addOptionOnSelect(event.target.dataset.idNum, event.target.dataset.selectId));


}


const restateAllModels = function () {

    const allModelsInput = document.getElementsByClassName("fieldGroupModelName");
    const modelsInput = Object.keys(allModelsInput);
    let curField;
    let comboBox;

    for (let idx of modelsInput) {

        let curElm = allModelsInput[idx].parentNode.parentNode.nextElementSibling;
        curField = curElm.getElementsByClassName("databaseField");

        if (curField.length > 0) {

            let curInput = curField[0].dataset.model;
            allModelsInput[idx].value = curInput;

        }

    }

    document.getElementById("spinningContent").style.display = "none";
    document.getElementById("formArea").style.display = "";

}


function closePreview() {

    let previewContainer = document.getElementById("previewFormContainer");
    document.body.removeChild(previewContainer);
    FormVariables.counter = 1;

}

const nextForm = function () {
    FormVariables.counter++;
    formNavigate();
}

const prevForm = function () {
    FormVariables.counter--;
    formNavigate();
}


const removeConfigOptionsOnPreview = function (onCreationForm) {

    onCreationForm = onCreationForm
        .replace(/class="top10px removeComponent lineRemover"/g, /style="display: none;"/)
        .replace(/class="posAbsolute removeComponent componentRemover"/g, /style="display: none;"/)
        .replace(/class="inputComponentIcon inputConfigIcon"/g, /style="display: none;"/)

    return onCreationForm;


}


const spinningObjects = function(){

    let spinningContainer = document.createElement("div");
    spinningContainer.id = "spinningContainer";
    spinningContainer.innerHTML = spinningContent();
    spinningContainer.style.textAlign = "center";
    spinningContainer.style.position = "absolute";
    spinningContainer.style.margin = "0 auto";
    spinningContainer.style.width = "100%";
    spinningContainer.style.zIndex = "100";
    spinningContainer.style.display = "none";


    let spinningCurtain = document.createElement("div");
    spinningCurtain.id = "spinningCurtain";
    spinningCurtain['style'] = `position: absolute;width: 100%;top: 0;left: 0;height: 100%;background: rgba(255,255,255,.8); display: none;`;

    return {spinningContainer, spinningCurtain};

}


const previewLinkedForms = function () {


    let navFormBtns = document.createElement("div");
    navFormBtns.id = "formNavFormBtns";
    navFormBtns.style.height = "25px";
    //navFormBtns.style.border = "1px solid red";

    let headerContainer = document.createElement("div");
    headerContainer.id = "formHeaderContainer";
    headerContainer.innerHTML = `${CLOSEBTN}${SAVEBTN}`;

    let navButtonsContainer = document.createElement("div");
    headerContainer.id = "formNavButtonsContainer";

    let previewContainer = document.createElement("div");
    previewContainer.id = "previewFormContainer";

    let formContainer = document.createElement("div");
    formContainer.id = "formContainerContainer";
    formContainer.style.display = "none";
    formContainer.style.marginTop = "10px";

    const spinner = spinningObjects();

    previewContainer.appendChild(headerContainer);
    previewContainer.appendChild(navFormBtns);
    previewContainer.appendChild(navButtonsContainer);
    previewContainer.appendChild(spinner.spinningContainer);
    previewContainer.appendChild(spinner.spinningCurtain);
    previewContainer.appendChild(formContainer);

    document.body.appendChild(previewContainer);

    formNavigate();

}


const submitBtns = {
    "lastForm": `<button onclick='formSumit()' style="margin-top: 5px;">Guardar</button>`,
    "hasNext": `<button onclick='nextForm()' style="margin-top: 5px;">Proximo</button>`,
    "hasPrev": `<button onclick='prevForm()' style="margin-top: 5px;">Anterior</button>`
}
const formNavigate = function () {

    let onCreationForm = '';
    let nextFormBtn = ``;
    let prevFormBtn = '';

    document.getElementById("spinningContainer").style.display = "";
    document.getElementById("formContainerContainer").style.display = "none";

    let formBucketContent = Object.keys(FormBucket);

    if (formBucketContent.length > 1 && FormVariables.counter > 1)
        prevFormBtn = submitBtns['hasPrev'];


    if (formBucketContent.length == 1 || formBucketContent.length == FormVariables.counter)
        onCreationForm = FormBucket[formBucketContent.length] || '';

    else if (formBucketContent.length > 1) {
        onCreationForm = FormBucket[FormVariables.counter] || '';
        nextFormBtn = submitBtns['hasNext'];
    }

    document.getElementById("formNavFormBtns").innerHTML = `${prevFormBtn}${`&nbsp;${nextFormBtn}`}`;
    document.getElementById("formContainerContainer").innerHTML = `${onCreationForm}`;

    setTimeout(async () => {

        const context = document.getElementById("formContainerContainer");
        await parseFormToUserView(context);
        document.getElementById("formContainerContainer").style.display = "";
        document.getElementById("spinningContainer").style.display = "none";

    }, 500);

}

const previewForm = function () {

    const spinner = spinningObjects();

    let onCreationForm = document.getElementById("formArea").innerHTML;
    let previewContainer = document.createElement("div");
    previewContainer.id = "previewFormContainer";
    previewContainer.style.display = "none";


    const actions = `${CLOSEBTN}${SAVEBTN}`;

    document.body.appendChild(previewContainer);
    document.getElementById("previewFormContainer").innerHTML = `${spinner.spinningContainer.outerHTML}
                                                                 ${spinner.spinningCurtain.outerHTML}
                                                                 ${actions}
                                                                 ${onCreationForm}`;

    setTimeout(async () => {
        await parseFormToUserView();
    }, 500);

}

const parseFormToUserView = async function (ctx) {
    console.log(`CHamou o aqui`);
    const context = ctx || document.getElementById("previewFormContainer");
    await removeNewOptionContainer(context);
    await removeRemoveComponent(context);
    await resetLabelPos(context);
    await resetFormLines(context);
    await resetSelectPos(context);
    await removeConfigButtons(context);
    await resetOptionGroupContainer(context);
    await removeConfigContnent(context);
    document.getElementById("previewFormContainer").style.display = "";

}

const handleSpinner = function (stat) {

    const statuses = {
        "show": "",
        "hide": "none"
    }

    document.getElementById("spinningContainer").style.display = statuses[stat];
    document.getElementById("spinningCurtain").style.display = statuses[stat];

}

const showMessageToast = function (msg) {

    if (document.getElementById("toastMessageContainer")) {
        const existingToast = document.getElementById("toastMessageContainer");
        existingToast.parentNode.removeChild(existingToast);
    }

    const toaster = document.createElement("div");
    toaster.id = "toastMessageContainer";
    toaster.innerHTML = msg;

    document.body.appendChild(toaster);

    let x = document.getElementById("toastMessageContainer")
    x.className = "show";

    setTimeout(function () { x.className = x.className.replace("show", ""); }, 5000);


    // ok, neste caso tem de se rever s configurações, ele estava acessível 
    // function launch_toast() {

    //}

}

const sendForm = function (content, fields = "", fieldTypes = "") {

    const SERVER = "http://localhost:5000";
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${SERVER}/newForm`, true);

    const form = new FormData();
    form.append("formContent", content);
    form.append("databaseFields", JSON.stringify(fields));
    form.append("fieldTypes", JSON.stringify(fieldTypes));
    form.append("statedFormName", document.getElementById("statedFormName").value);
    if (Object.keys(FormBucket).length > 1)
        form.append("linkedForms", true);

    console.log(`Tipos definidos:`);
    console.log(JSON.stringify(fieldTypes));
    
    xhr.send(form);

    xhr.onloadend = function () {

        if (xhr.readyState == 4) {
            console.log(`Resultado e: `);
            handleSpinner("hide");
            showMessageToast("Form gerado com sucesso");
            console.log(xhr.responseText);
        }

    }

}

const saveForm = async function () {

    handleSpinner("show");
    if (Object.keys(FormBucket).length > 0) {
        await saveLinkedForm();
        return;
    }

    const ctx = document.getElementById("previewFormContainer");
    const databaseFieldList = ctx.getElementsByClassName("databaseField");
    parseAndSaveFormContent(ctx)

}

const saveLinkedForm = async function () {

    const ctx = document.getElementById("formContainerContainer");
    let linkedFormsContent = "";
    let counter = 0;

    let allForms = Object.keys(FormBucket);
    for (idx of allForms) {

        if (counter == 0) {
            linkedFormsContent += `<span class="formWizardPage">${FormBucket[idx]}</span>`;
            counter++;
        } else
            linkedFormsContent += `<span class="formWizardPage" style="display:none;">${FormBucket[idx]}</span>`;

    }

    ctx.innerHTML = linkedFormsContent;

    await parseFormToUserView(ctx);
    setTimeout(() => parseAndSaveFormContent(ctx), 1000);

}

const parseAndSaveFormContent = function (ctx) {

    const databaseFieldList = ctx.getElementsByClassName("databaseField");
    let allDatabaseField = {};
    let allFieldTypes = {};
    let idx = 0;
    let standardDatatype = "text";


    for (let field in databaseFieldList) {
        let curField = databaseFieldList[field];
        console.log(`Existing field: ${curField.id}`);

        if (curField.nodeName) {

            if (curField.name != "" && (curField.nodeName.toLowerCase() == "input" || curField.nodeName.toLowerCase() == "select")) {
                let modelName = curField.dataset.model ? `${curField.dataset.model}.` : "";
                if (!Object.keys(allDatabaseField).includes(`${modelName}${curField.name}`)){
                    allDatabaseField[`${modelName}${curField.name}`] = "";
                    allFieldTypes[(++idx)] = `${(curField.dataset.type || standardDatatype)}`;
                }
            }
        }

    }

    const formContent = document.getElementById("previewFormContainer").innerHTML;
    let realForm = formContent.replace(CLOSEBTN, "").replace(SAVEBTN, "");
    realForm += `<button onclick='formSumit()'>Guardar</button>`;

    console.log(`Campos encontrados:`);
    console.log(allDatabaseField);

    sendForm(realForm, allDatabaseField, allFieldTypes);


}

async function removeNewOptionContainer(ctx) {

    let allContainers = ctx.getElementsByClassName("newOptionContainer");
    for (let idx = 0; idx < allContainers.length; idx++) {
        allContainers[idx].style.display = "none";
    }

}

async function removeConfigButtons(ctx) {

    let allConfigs = ctx.getElementsByClassName("inputComponentIcon");
    for (let idx = 0; idx < allConfigs.length; idx++) {
        allConfigs[idx].style.display = "none";
    }

}

async function removeRemoveComponent(ctx) {

    let allContainers = ctx.getElementsByClassName("removeComponent");
    for (let idx = 0; idx < allContainers.length; idx++) {
        allContainers[idx].style.display = "none";
        allContainers[idx].style.border = "none";
    }

}

async function resetLabelPos(ctx) {

    let allContainers = ctx.getElementsByClassName("formInputLabel");
    for (let idx = 0; idx < allContainers.length; idx++) {
        allContainers[idx].classList.remove("paddingLeft10px");
        allContainers[idx].contentEditable = false;
    }

}

function resetLineDragEvent(ctx) {

    let components = document.getElementsByClassName("formNewLine");
    for (let x = 0; x < components.length; x++) {

        components[x].ondragover = event => draggingOnPlaceholder(event);
        components[x].ondrop = event => dropOnPlaceholder(event);

    }

}

async function removeConfigContnent(ctx) {

    /*
    let allConfigs = ctx.getElementsByClassName("inputConfigPanel");

    for (let idx = 0; idx < allConfigs.length; idx++) {
        allConfigs[idx].parentNode.removeChild(allConfigs[idx]);
    }
    */

}

async function resetFormLines(ctx) {

    let allContainers = ctx.getElementsByClassName("formNewLine");
    for (let idx = 0; idx < allContainers.length; idx++) {
        allContainers[idx].style.minHeight = "45px";
        allContainers[idx].style.marginTop = "5px";
    }

}

async function resetSelectPos(ctx) {

    let allSelects = ctx.getElementsByClassName("selectComponent");
    for (let idx = 0; idx < allSelects.length; idx++) {
        allSelects[idx].style.marginTop = "-2px";
    }

}


async function resetOptionGroupContainer(ctx) {

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
        <select class="editing_tabel fieldGroupModelName" onchange="setFieldsModelName(event)" id="entityName${id}">
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

const resetAllModelNameInputs = function (callback) {

    const modelLists = document.getElementsByClassName("fieldGroupModel");

    let component = `
        <select class="editing_tabel fieldGroupModelName" onchange="setFieldsModelName(event)">
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

    if (callback)
        callback();

}

const updateActiveForm = function () {
    if (FormVariables.activeForm) {
        FormBucket[FormVariables.activeForm] = document.getElementById("formArea").innerHTML;
    }
}