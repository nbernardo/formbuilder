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



const showConfig = function (idComponente) {
    document.getElementById(idComponente).style.display = "";
    GlobalFacade.activeFieldConfig.push(idComponente)
}

const hideConfig = function (idComponente) {
    document.getElementById(idComponente).style.display = "none";
}


const GlobalFacade = {
    activeFieldConfig: []
}

window.onclick = function(event){

    let activedConfigs = GlobalFacade.activeFieldConfig;
    let clickedConfig = undefined;
    
    if(clickedConfig = event.target.dataset.panel){
        activedConfigs = activedConfigs.filter((v) => v != clickedConfig);
    }

    activedConfigs.forEach((v) => {
        document.getElementById(v).style.display = "none";
    })

    console.log(`Clicou agora`);

}