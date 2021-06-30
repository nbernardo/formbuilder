let charToReplace = [
    {"a":"ã|â|á|à"},
    {"e":"ẽ|ê|é|è"},
    {"i":"ĩ|î|í|ì"},
    {"o":"õ|ô|ó|ò"},
    {"u":"ũ|û|ú|ù"},
]


String.prototype.capitalize = function(){

    let stringSnippets = this.split(" ");
    let finalString = "";

    for(let x = 0; x < stringSnippets.length; x++){
        finalString += stringSnippets[x].charAt(0).toUpperCase()+stringSnippets[x].substr(1)+" ";
    }

    return finalString;

}


String.prototype.toCamelCase = function(){

    let newString = this.capitalize();
    newString = newString.charAt(0).toLowerCase() + newString.substr(1);
    return newString;

}


String.prototype.removeSpaces = function(){
    return this.replace(/\s/g,"");
}


/** 
 @param {String} text
 @param {Array} values
*/

function extractProperIdValue(values, text) {

    let finalString = `"${text.toCamelCase().removeSpaces()}"`;

    for (let x = 0; x < values.length; x++) {

        const curLetter = Object.keys(values[x]);
        const toReplace = Object.values(values[x]);
        let itemsToReplace = toReplace[0].split("|");

        for (let x1 = 0; x1 < itemsToReplace.length; x1++) {
            finalString += `.replace(/${itemsToReplace[x1]}/ig,"${curLetter}")`;
        }

    }

    return finalString.toString();

}


console.log("Agora o primeirão dá só dàgora âto o OutrÔ Ũ".capitalize().removeSpaces());
//return;


let result = extractProperIdValue(charToReplace, "Agora o primeirão dá só dàgora âto o OutrÔ Ũ");
result = eval(result);
console.log(result);
