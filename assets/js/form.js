function closePreview() {

    let previewContainer = document.getElementById("previewFormContainer");
    document.body.removeChild(previewContainer);

}


const previewForm = function () {

    let onCreationForm = document.getElementById("formArea").innerHTML;
    let previewContainer = document.createElement("div");
    previewContainer.id = "previewFormContainer";
    previewContainer.style.display = "none";

    const closeBtn = `<span class="closePreview btnAbb" onclick="closePreview()">X</span>`;

    document.body.appendChild(previewContainer);
    document.getElementById("previewFormContainer").innerHTML = `<br>${closeBtn}<br><br>${onCreationForm}`;

    setTimeout(() => {

        const context = document.getElementById("previewFormContainer");
        removeNewOptionContainer(context);
        removeRemoveComponent(context);
        resetLabelPos(context);
        resetFormLines(context);
        resetOptionGroupContainer(context);
        document.getElementById("previewFormContainer").style.display = "";

    }, 500);

}


function removeNewOptionContainer(ctx) {

    let allContainers = ctx.getElementsByClassName("newOptionContainer");
    for (let idx = 0; idx < allContainers.length; idx++) {
        allContainers[idx].style.display = "none";
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

function resetFormLines(ctx) {

    let allContainers = ctx.getElementsByClassName("formNewLine");
    for (let idx = 0; idx < allContainers.length; idx++) {
        allContainers[idx].style.minHeight = "45px";
    }

}


function resetOptionGroupContainer(ctx) {

    try {

        ctx
            .getElementsByClassName("optionGroupContainer")[0]
            .getElementsByTagName("span")[0]
            .classList.remove("left5px");

    } catch (error) {}

}