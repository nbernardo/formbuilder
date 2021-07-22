const movingComponent = {
    type: null,
    props: {},
    create: function () {

        const values = {...movingComponent.props};
        const component = new Component();
        console.log(`Moving the component: ${movingComponent.type}`);
        return component[`new${movingComponent.type}`](values);

    }
}

const LINEPLACEHOLDER = "Arraste aqui o componente";

const drag = {
    LINEPLACEHOLDER
}

function newComponen(e) {

    e.preventDefault();
    const newComponent = movingComponent.create();
    
    if (document.getElementById(`${e.target.id}`).innerHTML == LINEPLACEHOLDER) {
        document.getElementById(`${e.target.id}`).innerHTML = "";
        document.getElementById(`${e.target.id}`).style.color = "black";
    }

    document.getElementById(`${e.target.id}`).appendChild(newComponent);
    e.target.style.background = "white";

}


function allowDrag(e) {

    e.target.style.background = "#f8f8f8";
    e.preventDefault();


}


function dragging(e) {

    e.preventDefault();
    movingComponent.type = e.target.dataset.type;
    movingComponent.props = {
        placeholder: 'Digite um texto',
    };
    console.log(e.dataTransfer);
    newComponentLine(e);

}

function getLastFormLine() {

    let allLines = document.getElementsByClassName("formNewLine");
    if (allLines.length == 0) return false;

    let lastLine = allLines[allLines.length - 1];
    return lastLine;

}

function getTotalLines() {
    return parseInt(document.getElementsByClassName("formNewLine").length);
}

function newComponentLine(e) {

    const isLastLineEmpty = function () {

        let lastLine = getLastFormLine();
        if (lastLine == false) return false;
        if (lastLine.innerHTML == LINEPLACEHOLDER) {
            return true;
        }

    }

    if (isLastLineEmpty())
        return;

    const newLine = document.createElement("div");
    newLine.style.color = "lightgrey";    

    newLine.ondragover = function (e) {

        const isLineEmpty = function () {

            let targetedLine = document.getElementById(`${e.target.id}`);
            return targetedLine.getElementsByTagName("span").length > 0 ? false : true;

        }

        e.preventDefault();
        allowDrag(e);
        console.log("Arrastando na nova linha");

        if (!isLineEmpty())
            document.getElementById(`${e.target.id}`).style.display = "flex";

    }

    newLine.ondrop = function (e) {

        e.preventDefault();
        newComponen(e);
        console.log(`Lagrou o objecto na linha nova`);
    }
    newLine.className = "formNewLine";
    
    newLine.id = `formNewLine${(new Date).getTime()}`;
    newLine.innerHTML = LINEPLACEHOLDER;

    const removeLineBtn = document.createElement("span");

    removeLineBtn.innerHTML = `
        x Remover linha
        <select class="editing_tabel" id="entityName${newLine.id}">
            <option value="">Selecione a entidade</option>
        </select>
    `;
    removeLineBtn.className = `top10px removeComponent lineRemover`;

    removeLineBtn.onclick = function(event){
        
        if(event.target.className == "editing_tabel")
            return;

        let curLine = document.getElementById(newLine.id);
        document.getElementById("formArea").removeChild(curLine);
        document.getElementById("formArea").removeChild(removeLineBtn);
    }

    document.getElementById("formArea").appendChild(removeLineBtn);
    document.getElementById("formArea").appendChild(newLine);

    setTimeout(() => {

        modelsNameLista.forEach((val) => {

            let newModelName = document.createElement("option");
            newModelName.value = val;
            newModelName.innerText = val;

            document.getElementById(`entityName${newLine.id}`).appendChild(newModelName);

        })
        

    }, 300);


}

function leaveDrag(e) {
    document.getElementById("formArea").style.background = 'white';
    e.target.style.background = "white";
}


