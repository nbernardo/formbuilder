class Component {

    optionsName;

    newComponent(type){
        return document.createElement(type);
    }

    newContainer(type){
        
        let container = this.newComponent(type);
        let removeBtn = this.newComponent("span");

        let componentId = (new Date()).getTime();
        let containerId = `inputContainer_${componentId}`;
        container.id = containerId;
        container.classList.add("left5px");
        container.classList.add("displayCol");

        removeBtn.innerHTML = "x";
        removeBtn.className = "posAbsolute removeComponent";

        removeBtn.addEventListener('click', (event) => {
            
            let container = event.target.parentNode;
            let targetedLine = container.parentNode;
            targetedLine.removeChild(container);
            
            if(targetedLine.innerHTML == ""){
                targetedLine.innerHTML = drag.LINEPLACEHOLDER;
                targetedLine.style.color = "lightgrey";
            }

        });

        container.appendChild(removeBtn);
        return container;

    }

    newGroup(){

        const container = this.newComponent("div");
        const group = this.newComponent("fieldset");
        const legend = this.newComponent("legend");

        legend.appendChild(this.newLabel());
        group.appendChild(legend);

        container.appendChild(group);

        return container;

    }

    newLabel(ctx){
        
        const lable = document.createElement("label");
        lable.contentEditable = true;
        lable.className = "formInputLabel paddingRight10px paddingLeft10px textBold";
        lable.innerHTML = "Nome do campo";

        lable.onkeyup = function(event){

            let comboBox = ctx.getElementsByTagName("select");
            if(comboBox.length > 0){
                comboBox[0].name = extractProperIdValue(event.target.innerHTML);
                comboBox[0].classList.add("databaseField");
                return;
            }

            //ctx.getElementsByTagName("input")[0].value = extractProperIdValue(event.target.innerHTML);
            const inputFields = ctx.getElementsByTagName("input");
            const totalFields = inputFields.length;

            if(totalFields == 1){
                ctx.getElementsByTagName("input")[0].name = extractProperIdValue(event.target.innerHTML);
                ctx.getElementsByTagName("input")[0].classList.add("databaseField");
            }

            if(totalFields > 1){
                for(let x = 0; x < totalFields; x++){
                    ctx.getElementsByTagName("input")[x].name = extractProperIdValue(event.target.innerHTML);
                    ctx.getElementsByTagName("input")[x].classList.add("databaseField");
                }
            }


        }

        return lable;

    }

    newInput({nome, placeholder, required}){

        let component = this.newComponent("input");
        let props = {nome, placeholder, required};
        let container = this.newContainer("span");

        for(let prop in props)
            component[prop] = props[prop];
        
        console.log(`Creating Input component from class`);
        container.appendChild(this.newLabel(container));
        container.appendChild(component);
        return container;

    }

    generateRadio(optionsContainer, values, value){

        let component = this.newComponent("input");
        component.type = "radio";
        component.name = `optionGroup_${this.optionsName}`;
        let label = this.newComponent("label");
        label.contentEditable = true;
        label.classList.add("optionLabel");
        label.innerHTML = values[value];

        let optionGroup = this.newComponent("span");
        optionGroup.className = "left5px";
        optionGroup.appendChild(label);
        optionGroup.appendChild(component);

        optionsContainer.className = "displayRow optionGroupContainer";
        optionsContainer.appendChild(optionGroup);

        return optionsContainer;

    }

    newRadio({nome, placeholder, required, options}){

        let container = this.newContainer("span");
        let optionsContainer = this.newComponent("div");

        this.optionsName = (new Date()).getTime();
        container.id = `optionGroupContainer_${this.optionsName}`;
        container.className = "left5px";

        const values = options ? [...options] : ["Op????o1", "Op????o2"];
        container.appendChild(this.newLabel(container));

        for(let value in values){

            let optionsResult = this.generateRadio(optionsContainer, values, value);
            container.appendChild(optionsResult);

        }

        console.log(`Creating Radio component`);
        return container;

    }


    newSelect(){

        let idNum = (new Date()).getTime();
        let idSelect = `select_${idNum}`;
        const newComponent = this.newComponent;

        const addButton = function(id){

            let inputValue = document.getElementById(`newText_${id}`);
            if(inputValue.value == "") return false;

            let totalOptions = document.getElementById(idSelect).getElementsByTagName("option").length;
            let newOption = newComponent("option");
            newOption.innerHTML = inputValue.value;
            newOption.value = parseInt(totalOptions) + 1;
            document.getElementById(`select_${id}`).appendChild(newOption);
            document.getElementById(`select_${id}`).click();
            inputValue.value = "";

        }

        let container = this.newContainer("span");
        container.appendChild(this.newLabel(container));

        let addOptionBtn = newComponent("span");
        addOptionBtn.classList = "displayRow newOptionContainer";
        let btn = newComponent("a");
        btn.innerHTML = "Adicionar";
        btn.className = "addBtn";
        btn.onclick = () => addButton(idNum);

        let newOptionText = newComponent("input");
        newOptionText.id = `newText_${idNum}`;
        newOptionText.placeholder = `Digite o novo lista`;
        newOptionText.className = "newOptionInput";

        addOptionBtn.appendChild(newOptionText);
        addOptionBtn.appendChild(btn);
        container.appendChild(addOptionBtn);

        let component = newComponent("select");
        component.id = `${idSelect}`;
        component.className = "top5px selectComponent";

        let firstOption = newComponent("option");
        firstOption.innerHTML = "SELECCIONE";
        firstOption.value = "";

        component.appendChild(firstOption);
        container.appendChild(component);

        return container;

    }



    generateCheck(optionsContainer, values, value){

        let component = this.newComponent("input");
        component.type = "checkbox";
        component.name = `optionGroup_${this.optionsName}`;
        let label = this.newComponent("label");
        label.contentEditable = true;
        label.classList.add("optionLabel");
        label.innerHTML = values[value];

        let optionGroup = this.newComponent("span");
        optionGroup.className = "left5px";
        optionGroup.appendChild(label);
        optionGroup.appendChild(component);

        optionsContainer.className = "displayRow optionGroupContainer";
        optionsContainer.appendChild(optionGroup);

        return optionsContainer;

    }

    newCheck({nome, placeholder, required, options}){

        let container = this.newContainer("span");
        let optionsContainer = this.newComponent("div");

        this.optionsName = (new Date()).getTime();
        container.id = `optionGroupContainer_${this.optionsName}`;
        container.className = "left5px";

        const values = options ? [...options] : ["Op????o1", "Op????o2"];
        container.appendChild(this.newLabel(container));

        for(let value in values){

            let optionsResult = this.generateCheck(optionsContainer, values, value);
            container.appendChild(optionsResult);

        }

        console.log(`Creating Radio component`);
        return container;

    }



}