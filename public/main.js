"use strict";
class App {
    constructor() {
        this.appContainer = document.getElementById("app");
        this.notes = JSON.parse(localStorage.getItem("notes"));
        this.checkSavedNotes();
        this.createAddButton();
    }
    checkSavedNotes() {
        if (this.notes) {
            this.notes.forEach((note) => this.appContainer.appendChild(this.addNewNote(note)));
        }
    }
    createAddButton() {
        var _a;
        const button = document.createElement("button");
        button.className = "add";
        button.id = "add";
        const plusIcon = document.createElement("i");
        plusIcon.className = "fas fa-plus";
        button.appendChild(plusIcon);
        const textNode = document.createTextNode("Add note");
        button.appendChild(textNode);
        this.appContainer.appendChild(button);
        (this.notes === null || ((_a = this.notes) === null || _a === void 0 ? void 0 : _a.length) < 1) &&
            button.classList.add("animation");
        button.addEventListener("click", () => {
            button.classList.remove("animation");
            this.appContainer.appendChild(this.addNewNote());
        });
    }
    addNewNote(text = "") {
        const note = document.createElement("div");
        note.className = "note";
        const tools = document.createElement("div");
        tools.className = "tools";
        const main = document.createElement("div");
        main.className = `${text ? "main" : "main hidden"}`;
        main.innerText = text;
        const textArea = document.createElement("textarea");
        textArea.className = `${text ? "hidden" : ""}`;
        textArea.placeholder = "add your note here";
        textArea.autofocus = true;
        textArea.value = text;
        const img = document.createElement("img");
        img.src = "./assets/pin.png";
        !text && img.classList.add("hidden");
        tools.appendChild(img);
        tools.appendChild(new ToolButton(`${text ? "Edit" : "Save"}`, "edit", "fas fa-edit").createButton());
        tools.appendChild(new ToolButton("Delete", "delete", "fas fa-trash-alt").createButton());
        note.append(tools);
        note.appendChild(main);
        note.appendChild(textArea);
        const editBtn = note.querySelector(".edit");
        const deleteBtn = note.querySelector(".delete");
        deleteBtn.addEventListener("click", () => {
            note.remove();
            this.updateLS();
            const savedNotes = JSON.parse(localStorage.getItem("notes"));
            const addButton = document.querySelector(".add");
            if (savedNotes.length < 1) {
                addButton.classList.add("animation");
            }
        });
        editBtn.addEventListener("click", () => {
            if (!textArea.value.trim())
                return;
            main.classList.toggle("hidden");
            textArea.classList.toggle("hidden");
            const icon = document.createElement("i");
            icon.className = "fas fa-edit";
            const saveTxt = document.createTextNode("Save");
            const editTxt = document.createTextNode("Edit");
            if (editBtn.innerText === "Save") {
                editBtn.innerText = "";
                img.classList.remove("hidden");
                editBtn.appendChild(icon);
                editBtn.appendChild(editTxt);
            }
            else {
                editBtn.innerText = "";
                img.classList.add("hidden");
                editBtn.appendChild(icon);
                editBtn.appendChild(saveTxt);
            }
        });
        textArea.addEventListener("input", (e) => {
            const { value } = e.target;
            main.innerText = value;
            this.updateLS();
        });
        return note;
    }
    updateLS() {
        const notesText = document.querySelectorAll("textarea");
        const notes = [];
        notesText.forEach((note) => note.value.trim() && notes.push(note.value));
        localStorage.setItem("notes", JSON.stringify(notes));
    }
}
class ToolButton {
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
        button.appendChild(icon);
        button.appendChild(textNode);
        return button;
    }
}
new App();
//# sourceMappingURL=main.js.map