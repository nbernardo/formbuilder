const submitBtns = {
    "lastForm": `<button onclick='formSumit()' style="margin-top: 5px;">Guardar</button>`,
    "hasNext": `<button onclick='nextForm()' style="margin-top: 5px;">Proximo</button>`,
    "hasPrev": `<button onclick='prevForm()' style="margin-top: 5px;">Anterior</button>`
}

let wizardCounter = 0;
async function formNavigate() {

    let nextFormBtn = ``;
    let prevFormBtn = '';

    await hideForms();
    const wizardPages = document.getElementsByClassName("formWizardPage");

    document.getElementById("spinningContainer").style.display = "";
    document.getElementById("formContainerContainer").style.display = "none";

    let formBucketContent = Object.keys(wizardPages);

    if (formBucketContent.length > 1 && wizardCounter > 0)
        prevFormBtn = submitBtns['hasPrev'];


    if (formBucketContent.length == 1 || (formBucketContent.length - 1) == wizardCounter)
        wizardPages[0].style.display = "";

    else if (formBucketContent.length > 1) {
        wizardPages[wizardCounter].style.display = "";
        nextFormBtn = submitBtns['hasNext'];
    }

    document.getElementById("formNavFormBtns").innerHTML = `${prevFormBtn}${`&nbsp;${nextFormBtn}`}`;

    setTimeout(async () => {

        document.getElementById("formContainerContainer").style.display = "";
        document.getElementById("spinningContainer").style.display = "none";

    }, 500);

}

const nextForm = async function () {
    wizardCounter++;
    await formNavigate();
}

const prevForm = async function () {
    wizardCounter--;
    await formNavigate();
}


async function hideForms() {

    const wizardPages = document.getElementsByClassName("formWizardPage");
    for (let idx = 0; idx < wizardPages.length; idx++)
        wizardPages[idx].style.display = "none";

}