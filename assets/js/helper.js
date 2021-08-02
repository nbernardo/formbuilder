String.prototype.capitalize = function () {

    let stringSnippets = this.split(" ");
    let finalString = "";

    for (let x = 0; x < stringSnippets.length; x++) {
        finalString += stringSnippets[x].charAt(0).toUpperCase() + stringSnippets[x].substr(1) + " ";
    }

    return finalString;

}


String.prototype.toCamelCase = function () {

    let newString = this.capitalize();
    newString = newString.charAt(0).toLowerCase() + newString.substr(1);
    return newString;

}


String.prototype.removeSpaces = function () {
    return this.replace(/\s/g, "");
}


const isFormAreaEmpty = function () {

    const formArea = document.getElementById("formArea").getElementsByTagName("input");
    return formArea.length <= 0 ? true : false;

}

const disableOrAnableNewFormButton = function () {

    const btn = document.getElementById("newFormAddBtn");

    if (isFormAreaEmpty()) {
        btn.disabled = true;
        return;
    }

    btn.disabled = false;

}

const spinningContent = function (obj = {}) {
    return `
        <div>${obj.texto || 'Carregando, aguarde'}</div>
        <div class="lds-ellipsis">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
        </div>
    `;
}

/** 
 @param {String} text
 @param {Array} values
*/

const charToReplace = [
    { "a": "ã|â|á|à" },
    { "e": "ẽ|ê|é|è" },
    { "i": "ĩ|î|í|ì" },
    { "o": "õ|ô|ó|ò" },
    { "u": "ũ|û|ú|ù" },
];
const extractProperIdValue = function (text) {

    let finalString = `"${text.toCamelCase().removeSpaces()}"`;

    for (let x = 0; x < charToReplace.length; x++) {

        const curLetter = Object.keys(charToReplace[x]);
        const toReplace = Object.values(charToReplace[x]);
        let itemsToReplace = toReplace[0].split("|");

        for (let x1 = 0; x1 < itemsToReplace.length; x1++) {
            finalString += `.replace(/${itemsToReplace[x1]}/ig,"${curLetter}")`;
        }

    }
    return eval(finalString.replace("&nbsp;", ""));
}

const extractProperEntityName = function (text) {

    let finalString = `"${text.capitalize().removeSpaces()}"`;

    for (let x = 0; x < charToReplace.length; x++) {

        const curLetter = Object.keys(charToReplace[x]);
        const toReplace = Object.values(charToReplace[x]);
        let itemsToReplace = toReplace[0].split("|");

        for (let x1 = 0; x1 < itemsToReplace.length; x1++) {
            finalString += `.replace(/${itemsToReplace[x1]}/ig,"${curLetter}")`;
        }

    }
    return eval(finalString.replace("&nbsp;", ""));
}

//TO Test
//let result = extractProperIdValue("Agora o primeirão dá só dàgora âto o OutrÔ Ũ");
//console.log(result);


/** Input config helper functions */
const showConfig = function (idComponente) {
    document.getElementById(idComponente).style.display = "";
    GlobalFacade.activeFieldConfig.push(idComponente)
}

const hideConfig = function (idComponente) {
    document.getElementById(idComponente).style.display = "none";
}

const showRequiredMessageInput = function (idComponente, status, idInput) {

    let statusVal = { "true": "block", "false": "none" };
    document.getElementById(idComponente).style.display = statusVal[status];

    const component = document.getElementById(idInput);
    component.classList.add("requiredInputOnSubmission");

}


const populateComponent = function(event, idComponent){

    let component = document.getElementById(idComponent);
    let values = event.target.value.toString().split("\n");
    

    for(let value of values){

        const newComponent = document.createElement("option");
        newComponent.value = value;
        newComponent.innerHTML = value;
        component.appendChild(newComponent);

    }

}

const inputConfigMenuContent = ({ componentId, inputId, type }) => (

    `                    
    <img
    onclick="showConfig('${componentId}')"
    data-panel="${componentId}"
    src="assets/icons/config.png" 
    class="inputComponentIcon inputConfigIcon">

    <span
        onmouseover="showConfig('${componentId}')"  
        class="inputConfigPanel"
        style="display:none;" 
        id="${componentId}">

        <span
            onclick="hideConfig('${componentId}')" 
            class="posAbsolute removeComponent">
            x
        </span>

        <ul data-input="${inputId}" data-panel="${componentId}">
            <li>
                <label>Obrigatório:</label> 
                <input 
                    type="checkbox" 
                    onchange="showRequiredMessageInput('reqMsg${componentId}',this.checked,'${inputId}');defConfigProp('${inputId}',{prop: 'required', value: this.checked});">
            </li>
            <li id="reqMsg${componentId}" style="display:none;">
                <label>Mensagem erro:</label> 
                <input
                    onkeyup="defConfigProp('${inputId}',{data: 'requiredMessage', value: this.value});" 
                    type="text">
            </li>

            <li>
                <label>Texto guia:</label> 
                <input 
                    type="text"
                    onkeyup="defConfigProp('${inputId}',{prop: 'placeholder', value: (this.value != '' ? this.value : 'Digite um texto')});"
                    >
            </li>
            <li>
                <label>Tipo de dados:</label> 
                <select 
                    class="notDataFieldConsider"
                    onchange="defConfigProp('${inputId}',{data: 'type', value: this.value});"
                    type="text">
                    <option value="Char">Texto</option>
                    <option value="Text">Texto longo</option>
                    <option value="Int">Numero</option>
                    <option value="Float">Fração</option>
                </select>
            </li>
            ${
                type == 'select' ?
                `<li>
                    <label>Dados:</label> 
                    <textarea onblur="populateComponent(event,'${inputId}')" cols="25" rows="2"></textarea>
                 </li>` : ''
            }
            <li>
                <label>Qtd caracters:</label> 
                <input 
                    onkeyup="defConfigProp('${inputId}',{data: 'size', value: this.value});"
                    type="number">
            </li>
        </ul>
    </span>
    `

)


const defConfigProp = function (idInput, { data, prop, value }) {

    const component = document.getElementById(idInput);
    if (prop) {
        component[prop] = value;
        return;
    }

    component.dataset[data] = value;

}


const GlobalFacade = {
    activeFieldConfig: [],
    inputConfigMenuContent
}




window.onclick = function (event) {

    try {

        let activedConfigs = GlobalFacade.activeFieldConfig;
        let clickedConfig = [];

        if (clickedConfig = event.target.dataset.panel) {
            activedConfigs = activedConfigs.filter((v) => v != clickedConfig);
        }

        if (clickedConfig = event.target.parentNode.parentNode.dataset.panel) {
            activedConfigs = activedConfigs.filter((v) => v != clickedConfig);
        }

        if (clickedConfig = event.target.parentNode.parentNode.parentNode.dataset.panel) {
            activedConfigs = activedConfigs.filter((v) => v != clickedConfig);
        }

        activedConfigs.forEach((v) => {
            document.getElementById(v).style.display = "none";
        })

    } catch (error) {

    }

}


/**
 * Form Buildef helpers
 */
const removeComponent = function (event) {

    let container = event.target.parentNode;
    let targetedLine = container.parentNode;
    targetedLine.removeChild(container);

    if (targetedLine.innerHTML == "") {
        targetedLine.innerHTML = drag.LINEPLACEHOLDER;
        targetedLine.style.color = "lightgrey";
    }
    updateActiveForm();
    console.log(`From removeComponent calling`);

}


const removeLine = function (newLineId, removeLineBtn) {

    let curLine = document.getElementById(newLineId);

    try {
        document.getElementById("formArea").removeChild(curLine);
    } catch (error) { }

    try {
        document.getElementById("formArea").removeChild(removeLineBtn);
    } catch (error) { }

    updateActiveForm();
    console.log(`Line removed from line remover`);

}


const addOptionOnSelect = function (id, componentId) {

    let inputValue = document.getElementById(`newText_${id}`);
    if (inputValue.value == "") return false;

    let totalOptions = document.getElementById(componentId).getElementsByTagName("option").length;
    let newOption = document.createElement("option");
    newOption.innerHTML = inputValue.value;
    newOption.value = parseInt(totalOptions) + 1;
    document.getElementById(`select_${id}`).appendChild(newOption);
    document.getElementById(`select_${id}`).click();
    inputValue.value = "";

}