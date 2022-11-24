export class LoginInput {
  labelTxt: string;
  labelClass: string;
  inputType: string;
  inputAutocomplete: string;
  constructor(
    labelTxt: string,
    labelClass: string,
    inputType: string,
    inputAutocomplete: string
  ) {
    this.labelTxt = labelTxt;
    this.labelClass = labelClass;
    this.inputType = inputType;
    this.inputAutocomplete = inputAutocomplete;
  }

  createInput() {
    const label = document.createElement("label") as HTMLLabelElement;
    label.textContent = this.labelTxt;
    if (this.labelClass) label.className = this.labelClass;
    const input = document.createElement("input") as HTMLInputElement;
    input.type = this.inputType;
    input.autocomplete = this.inputAutocomplete;
    label.append(input);
    return label;
  }
}

export class ToolButton {
  btnTxt: string;
  btnClass: string;
  iconClass: string;
  constructor(btnTxt: string, btnClass: string, iconClass: string) {
    this.btnTxt = btnTxt;
    this.btnClass = btnClass;
    this.iconClass = iconClass;
  }

  createButton() {
    const button = document.createElement("button") as HTMLButtonElement;
    button.className = this.btnClass;
    const icon = document.createElement("i");
    icon.className = this.iconClass;
    const textNode = document.createTextNode(this.btnTxt);
    button.append(icon, textNode);
    return button;
  }
}
