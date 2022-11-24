export class LoginInput {
    constructor(labelTxt, labelClass, inputType, inputAutocomplete) {
        this.labelTxt = labelTxt;
        this.labelClass = labelClass;
        this.inputType = inputType;
        this.inputAutocomplete = inputAutocomplete;
    }
    createInput() {
        const label = document.createElement("label");
        label.textContent = this.labelTxt;
        if (this.labelClass)
            label.className = this.labelClass;
        const input = document.createElement("input");
        input.type = this.inputType;
        input.autocomplete = this.inputAutocomplete;
        label.append(input);
        return label;
    }
}
export class ToolButton {
    constructor(btnTxt, btnClass, iconClass) {
        this.btnTxt = btnTxt;
        this.btnClass = btnClass;
        this.iconClass = iconClass;
    }
    createButton() {
        const button = document.createElement("button");
        button.className = this.btnClass;
        const icon = document.createElement("i");
        icon.className = this.iconClass;
        const textNode = document.createTextNode(this.btnTxt);
        button.append(icon, textNode);
        return button;
    }
}
//# sourceMappingURL=creators.js.map