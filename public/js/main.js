var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { LoginInput, ToolButton } from "./creators.js";
class App {
    constructor() {
        this.appContainer = document.getElementById("app");
        this.notes = [];
        this.token = "";
        this.userName = "";
        this.createLoginButton();
        this.loginModal();
    }
    clearAppContainer(parent) {
        while (parent.firstChild) {
            parent.removeChild(parent.firstChild);
        }
    }
    showError(element, msg) {
        element.textContent = msg;
        element.classList.add("show");
        const timer = setTimeout(() => {
            element.classList.remove("show");
        }, 3000);
        return () => clearTimeout(timer);
    }
    authSuccess(modalElm, inputs, token, name, greetingEl) {
        this.token = token;
        this.userName = name;
        modalElm.classList.remove("show");
        greetingEl.classList.add("show");
        inputs.forEach((input) => (input.value = ""));
        this.checkSavedNotes();
    }
    checkSavedNotes() {
        return __awaiter(this, void 0, void 0, function* () {
            const requestOptions = {
                method: "GET",
                headers: { Authorization: `Bearer ${this.token}` },
            };
            try {
                const response = yield fetch("/api/v1/notes", requestOptions);
                const data = yield response.json();
                this.notes = data.notes;
                this.clearAppContainer(this.appContainer);
                this.createAddNoteButton();
                this.createLoginButton();
                this.loginModal();
                this.notes.forEach((note) => {
                    this.appContainer.append(this.addNewNote(note.text, note._id));
                });
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    loginModal() {
        const modal = document.createElement("div");
        modal.className = "modal";
        const loginContainer = document.createElement("div");
        loginContainer.className = "modal_login";
        const createInput = (txt, className, type, bool) => {
            return new LoginInput(txt, className, type, bool).createInput();
        };
        const inputsContainer = document.createElement("div");
        inputsContainer.className = "modal_login_inputs";
        inputsContainer.append(createInput("Name:", "hide", "text", "false"), createInput("Email:", "", "email", "false"), createInput("Password:", "", "password", "false"));
        const [nameLabel, emailLabel, passwordLabel] = inputsContainer.children;
        const nameInput = nameLabel.firstElementChild;
        const emailInput = emailLabel.firstElementChild;
        const passwordInput = passwordLabel.firstElementChild;
        const loginInputs = [nameInput, emailInput, passwordInput];
        const buttonsContainer = document.createElement("div");
        buttonsContainer.className = "modal_login_buttons";
        const loginButton = document.createElement("button");
        loginButton.textContent = "Login";
        const cancelButton = document.createElement("button");
        cancelButton.textContent = "Cancel";
        const switchButton = document.createElement("p");
        switchButton.textContent = "Register";
        switchButton.className = "switch";
        const errorMsg = document.createElement("p");
        const greeting = document.createElement("p");
        greeting.className = "greeting";
        if (this.userName)
            greeting.textContent = `hi, ${this.userName}`;
        buttonsContainer.append(loginButton, cancelButton, switchButton, errorMsg);
        loginContainer.append(inputsContainer, buttonsContainer);
        modal.append(loginContainer);
        this.appContainer.append(modal, greeting);
        switchButton.addEventListener("click", () => {
            if (switchButton.textContent === "Register") {
                switchButton.textContent = "Login";
                loginButton.textContent = "Register";
                nameLabel.classList.remove("hide");
                loginInputs.forEach((input) => (input.value = ""));
            }
            else {
                switchButton.textContent = "Register";
                loginButton.textContent = "Login";
                nameLabel.classList.add("hide");
                loginInputs.forEach((input) => (input.value = ""));
            }
        });
        loginButton.addEventListener("click", () => __awaiter(this, void 0, void 0, function* () {
            const requestOptions = {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: nameInput.value,
                    email: emailInput.value,
                    password: passwordInput.value,
                }),
            };
            if (loginButton.textContent === "Register") {
                try {
                    const response = yield fetch("/api/v1/auth/register", requestOptions);
                    const data = yield response.json();
                    if (data.token) {
                        const token = data.token;
                        const userName = data.user.name;
                        this.authSuccess(modal, loginInputs, token, userName, greeting);
                        return;
                    }
                    this.showError(errorMsg, data.msg);
                }
                catch (error) {
                    console.log(error);
                }
                return;
            }
            try {
                requestOptions.body = JSON.stringify({
                    email: emailInput.value,
                    password: passwordInput.value,
                });
                const response = yield fetch("/api/v1/auth/login", requestOptions);
                const data = yield response.json();
                if (data.token) {
                    const token = data.token;
                    const userName = data.user.name;
                    this.authSuccess(modal, loginInputs, token, userName, greeting);
                    return;
                }
                this.showError(errorMsg, data.msg);
            }
            catch (error) {
                console.log(error);
            }
        }));
        cancelButton.addEventListener("click", () => {
            const login_btn = document.querySelector(".login_btn");
            modal.classList.remove("show");
            loginInputs.forEach((input) => (input.value = ""));
            !this.token && login_btn.classList.add("animation");
        });
    }
    createLoginButton() {
        const button = document.createElement("button");
        button.className = "login_btn animation";
        this.token && button.classList.remove("animation");
        const plusIcon = document.createElement("i");
        plusIcon.className = "fas fa-plus";
        const textNode = document.createTextNode("Login");
        button.append(plusIcon, textNode);
        button.addEventListener("click", () => {
            document.querySelector(".modal").classList.add("show");
            button.classList.remove("animation");
        });
        this.appContainer.append(button);
    }
    createAddNoteButton() {
        var _a;
        const button = document.createElement("button");
        button.className = "add";
        button.id = "add";
        const plusIcon = document.createElement("i");
        plusIcon.className = "fas fa-plus";
        const textNode = document.createTextNode("Add note");
        button.append(plusIcon, textNode);
        this.appContainer.appendChild(button);
        (this.notes === null || ((_a = this.notes) === null || _a === void 0 ? void 0 : _a.length) < 1) &&
            button.classList.add("animation");
        button.addEventListener("click", () => {
            button.classList.remove("animation");
            this.appContainer.append(this.addNewNote());
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
        main.textContent = text;
        const textArea = document.createElement("textarea");
        textArea.className = `${text ? "hidden" : ""}`;
        textArea.placeholder = "add your note here";
        textArea.autofocus = true;
        textArea.value = text;
        const img = document.createElement("img");
        img.src = "./assets/pin.png";
        !text && img.classList.add("hidden");
        const createButton = (btnTxt, btnClass, iconClass) => {
            return new ToolButton(btnTxt, btnClass, iconClass).createButton();
        };
        tools.append(img, createButton(`${text ? "Edit" : "Save"}`, "edit", "fas fa-edit"), createButton("Delete", "delete", "fas fa-trash-alt"));
        note.append(tools, main, textArea);
        const editBtn = note.querySelector(".edit");
        const deleteBtn = note.querySelector(".delete");
        deleteBtn.addEventListener("click", (e) => {
            const targetId = e.target.closest(".note").id;
            try {
                fetch(`/api/v1/notes/${targetId}`, {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${this.token}`,
                    },
                }).then(() => this.checkSavedNotes());
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
            if (editBtn.textContent === "Save") {
                const noteTxt = noteTextArea.value;
                const requestOptions = {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${this.token}`,
                    },
                    body: JSON.stringify({ text: noteTxt }),
                };
                if (!noteContainer.id) {
                    fetch("/api/v1/notes", requestOptions).then(() => this.checkSavedNotes());
                }
                else {
                    requestOptions.method = "PATCH";
                    fetch(`/api/v1/notes/${noteContainer.id}`, requestOptions).then(() => this.checkSavedNotes());
                }
                editBtn.textContent = "";
                img.classList.remove("hidden");
                editBtn.append(icon, editTxt);
            }
            else {
                editBtn.textContent = "";
                img.classList.add("hidden");
                editBtn.append(icon, saveTxt);
            }
        });
        textArea.addEventListener("input", (e) => {
            const { value } = e.target;
            main.textContent = value;
        });
        return note;
    }
}
new App();
//# sourceMappingURL=main.js.map