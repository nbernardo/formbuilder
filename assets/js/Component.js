const novoComp = new ComponentP();

function ComponentP(){

    this.chamou = function(){
        alert("Chamado o chamado");
    }

    this.newComponent = function(type){
        return document.createElement(type);
    }


    this.newInput = function({nome, placeholder, required}){

        let component = this.newComponent("input");
        const props = {nome, placeholder, required};

        for(prop in props){
            let curProp = prop;
            component[prop] = props[prop];
        }
        console.log(`Creating Input component`);
        return component;

    }


    this.newRadio = function(values = {}){

        let container = newComponen("span");
        let idx = 0;

        for(value in values){
            
            idx++;
            let component = newComponen("radio");
            let label = newComponen("label");
            label.innerHTML = values[value];

            let optionGroup = newComponen("span");
            optionGroup.appendChild(label);
            optionGroup.appendChild(component);

            container.appendChild(optionGroup);

        }

        console.log(`Creating Radio component`);
        return container;

    }

    return this;

}