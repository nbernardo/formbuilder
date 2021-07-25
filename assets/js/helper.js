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


/** 
 @param {String} text
 @param {Array} values
*/

const extractProperIdValue = function (text) {

    let charToReplace = [
        { "a": "ã|â|á|à" },
        { "e": "ẽ|ê|é|è" },
        { "i": "ĩ|î|í|ì" },
        { "o": "õ|ô|ó|ò" },
        { "u": "ũ|û|ú|ù" },
    ];

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

const inputConfigMenuContent = ({componentId, inputId}) => (

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
                    onchange="defConfigProp('${inputId}',{data: 'type', value: this.value});"
                    type="text">
                    <option value="Char">Texto</option>
                    <option value="Text">Texto longo</option>
                    <option value="Int">Numero</option>
                    <option value="Float">Fração</option>
                </select>
            </li>
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


const defConfigProp = function(idInput, {data, prop, value}){

    const component = document.getElementById(idInput);
    if(prop){
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

    let activedConfigs = GlobalFacade.activeFieldConfig;
    let clickedConfig = undefined;

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

}