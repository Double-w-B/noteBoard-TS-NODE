"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class App {
    constructor() {
        this.appContainer = document.getElementById("app");
        this.notes = [];
        this.checkSavedNotes();
    }
    checkSavedNotes() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield fetch("/api/v1/notes");
                const data = yield response.json();
                this.notes = data.notes;
                this.appContainer.innerHTML = "";
                this.createAddButton();
                this.notes.forEach((note) => {
                    this.appContainer.appendChild(this.addNewNote(note.text, note._id));
                });
            }
            catch (error) {
                console.log(error);
            }
        });
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
    addNewNote(text = "", id = "") {
        const note = document.createElement("div");
        note.className = "note";
        note.id = id;
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
        deleteBtn.addEventListener("click", (e) => {
            const targetId = e.target.closest(".note").id;
            try {
                fetch(`/api/v1/notes/${targetId}`, { method: "DELETE" }).then(() => this.checkSavedNotes());
            }
            catch (error) {
                console.log(error);
            }
        });
        editBtn.addEventListener("click", (e) => {
            if (!textArea.value.trim())
                return;
            const target = e.target;
            const noteContainer = target.closest(".note");
            const noteTextArea = noteContainer.lastChild;
            main.classList.toggle("hidden");
            textArea.classList.toggle("hidden");
            const icon = document.createElement("i");
            icon.className = "fas fa-edit";
            const saveTxt = document.createTextNode("Save");
            const editTxt = document.createTextNode("Edit");
            if (editBtn.innerText === "Save") {
                const noteTxt = noteTextArea.value;
                if (!noteContainer.id) {
                    const requestOptions = {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ text: noteTxt }),
                    };
                    fetch("/api/v1/notes", requestOptions);
                }
                else {
                    const requestOptions = {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ text: noteTxt }),
                    };
                    fetch(`/api/v1/notes/${noteContainer.id}`, requestOptions);
                }
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
        });
        return note;
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