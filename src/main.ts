import { LoginInput, ToolButton } from "./creators.js";

type Note = {
  _id?: string;
  text?: string;
  __v?: number;
};

class App {
  appContainer: HTMLDivElement;
  notes: object[];
  token: string;
  userName: string;

  constructor() {
    this.appContainer = document.getElementById("app") as HTMLDivElement;
    this.notes = [] as object[];
    this.token = "" as string;
    this.userName = "" as string;

    this.createLoginButton();
    this.loginModal();
  }

  clearAppContainer(parent: HTMLElement) {
    while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
    }
  }

  showError(element: HTMLElement, msg: string) {
    element.textContent = msg;
    element.classList.add("show");
    const timer = setTimeout(() => {
      element.classList.remove("show");
    }, 3000);
    return () => clearTimeout(timer);
  }

  authSuccess(
    modalElm: HTMLDivElement,
    inputs: HTMLInputElement[],
    token: string,
    name: string,
    greetingEl: HTMLParagraphElement
  ) {
    this.token = token;
    this.userName = name;
    modalElm.classList.remove("show");
    greetingEl.classList.add("show");
    inputs.forEach((input) => (input.value = ""));
    this.checkSavedNotes();
  }

  async checkSavedNotes(): Promise<void | (() => object[])> {
    const requestOptions = {
      method: "GET",
      headers: { Authorization: `Bearer ${this.token}` },
    };
    try {
      const response = await fetch("/api/v1/notes", requestOptions);
      const data = await response.json();

      this.notes = data.notes;
      this.clearAppContainer(this.appContainer);
      this.createAddNoteButton();
      this.createLoginButton();
      this.loginModal();
      this.notes.forEach((note: Note) => {
        this.appContainer.append(this.addNewNote(note.text, note._id));
      });
    } catch (error) {
      console.log(error);
    }
  }

  loginModal() {
    const modal = document.createElement("div") as HTMLDivElement;
    modal.className = "modal";
    const loginContainer = document.createElement("div") as HTMLDivElement;
    loginContainer.className = "modal_login";

    /* Inputs */
    const createInput = (
      txt: string,
      className: string,
      type: string,
      bool: string
    ) => {
      return new LoginInput(txt, className, type, bool).createInput();
    };
    const inputsContainer = document.createElement("div") as HTMLDivElement;
    inputsContainer.className = "modal_login_inputs";
    inputsContainer.append(
      createInput("Name:", "hide", "text", "false"),
      createInput("Email:", "", "email", "false"),
      createInput("Password:", "", "password", "false")
    );

    const [nameLabel, emailLabel, passwordLabel] = inputsContainer.children;
    const nameInput = nameLabel.firstElementChild as HTMLInputElement;
    const emailInput = emailLabel.firstElementChild as HTMLInputElement;
    const passwordInput = passwordLabel.firstElementChild as HTMLInputElement;
    const loginInputs = [nameInput, emailInput, passwordInput];

    /* Inputs */

    /* Buttons */
    const buttonsContainer = document.createElement("div") as HTMLDivElement;
    buttonsContainer.className = "modal_login_buttons";

    const loginButton = document.createElement("button") as HTMLButtonElement;
    loginButton.textContent = "Login";
    const cancelButton = document.createElement("button") as HTMLButtonElement;
    cancelButton.textContent = "Cancel";

    const switchButton = document.createElement("p") as HTMLParagraphElement;
    switchButton.textContent = "Register";
    switchButton.className = "switch";
    /* Buttons */

    /* Error message */
    const errorMsg = document.createElement("p") as HTMLParagraphElement;
    /* Error message */

    /* User greeting */
    const greeting = document.createElement("p") as HTMLParagraphElement;
    greeting.className = "greeting";
    if (this.userName) greeting.textContent = `hi, ${this.userName}`;
    /* User greeting */

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
      } else {
        switchButton.textContent = "Register";
        loginButton.textContent = "Login";
        nameLabel.classList.add("hide");
        loginInputs.forEach((input) => (input.value = ""));
      }
    });

    /* Login Button */
    loginButton.addEventListener("click", async () => {
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: nameInput.value,
          email: emailInput.value,
          password: passwordInput.value,
        }),
      };

      /* Register */
      if (loginButton.textContent === "Register") {
        try {
          const response = await fetch("/api/v1/auth/register", requestOptions);
          const data = await response.json();

          if (data.token) {
            const token = data.token;
            const userName = data.user.name;
            this.authSuccess(modal, loginInputs, token, userName, greeting);
            return;
          }
          this.showError(errorMsg, data.msg);
        } catch (error) {
          console.log(error);
        }
        return;
      }
      /* Register */

      /* Login */
      try {
        requestOptions.body = JSON.stringify({
          email: emailInput.value,
          password: passwordInput.value,
        });
        const response = await fetch("/api/v1/auth/login", requestOptions);
        const data = await response.json();

        if (data.token) {
          const token = data.token;
          const userName = data.user.name;
          this.authSuccess(modal, loginInputs, token, userName, greeting);
          return;
        }

        this.showError(errorMsg, data.msg);
      } catch (error) {
        console.log(error);
      }
      /* Login */
    });
    /* Login Button */

    /* Cancel Button */
    cancelButton.addEventListener("click", () => {
      const login_btn = document.querySelector(
        ".login_btn"
      ) as HTMLButtonElement;
      modal.classList.remove("show");
      loginInputs.forEach((input) => (input.value = ""));
      !this.token && login_btn.classList.add("animation");
    });
    /* Cancel Button */
  }

  createLoginButton() {
    const button = document.createElement("button") as HTMLButtonElement;
    button.className = "login_btn animation";
    this.token && button.classList.remove("animation");
    const plusIcon = document.createElement("i");
    plusIcon.className = "fas fa-plus";
    const textNode = document.createTextNode("Login");
    button.append(plusIcon, textNode);

    button.addEventListener("click", () => {
      document.querySelector(".modal")!.classList.add("show");
      button.classList.remove("animation");
    });

    this.appContainer.append(button);
  }

  createAddNoteButton() {
    const button = document.createElement("button") as HTMLButtonElement;
    button.className = "add";
    button.id = "add";
    const plusIcon = document.createElement("i");
    plusIcon.className = "fas fa-plus";
    const textNode = document.createTextNode("Add note");
    button.append(plusIcon, textNode);
    this.appContainer.appendChild(button);

    (this.notes === null || this.notes?.length < 1) &&
      button.classList.add("animation");

    button.addEventListener("click", () => {
      button.classList.remove("animation");
      this.appContainer.append(this.addNewNote());
    });
  }

  addNewNote(text = "", id = "") {
    const note = document.createElement("div") as HTMLDivElement;
    note.className = "note";
    note.id = id;

    const tools = document.createElement("div") as HTMLDivElement;
    tools.className = "tools";

    const main = document.createElement("div") as HTMLDivElement;
    main.className = `${text ? "main" : "main hidden"}`;
    main.textContent = text;

    const textArea = document.createElement("textarea") as HTMLTextAreaElement;
    textArea.className = `${text ? "hidden" : ""}`;
    textArea.placeholder = "add your note here";
    textArea.autofocus = true;
    textArea.value = text;

    const img = document.createElement("img");
    img.src = "./assets/pin.png";
    !text && img.classList.add("hidden");

    const createButton = (
      btnTxt: string,
      btnClass: string,
      iconClass: string
    ) => {
      return new ToolButton(btnTxt, btnClass, iconClass).createButton();
    };

    tools.append(
      img,
      createButton(`${text ? "Edit" : "Save"}`, "edit", "fas fa-edit"),
      createButton("Delete", "delete", "fas fa-trash-alt")
    );
    note.append(tools, main, textArea);

    /* Note buttons */
    const editBtn = note.querySelector(".edit") as HTMLButtonElement;
    const deleteBtn = note.querySelector(".delete") as HTMLButtonElement;

    /* Delete Button */
    deleteBtn.addEventListener("click", (e: MouseEvent) => {
      const targetId = (e.target as Element)!.closest(".note")!.id;
      try {
        fetch(`/api/v1/notes/${targetId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        }).then(() => this.checkSavedNotes());
      } catch (error) {
        console.log(error);
      }
    });
    /* Delete Button */

    /* Edit Button */
    editBtn.addEventListener("click", (e: MouseEvent) => {
      if (!textArea.value.trim()) return;

      const target = e.target as Element;
      const noteContainer = target.closest(".note");
      const noteTextArea = noteContainer!.lastChild as HTMLInputElement;

      main.classList.toggle("hidden");
      textArea.classList.toggle("hidden");

      const icon = document.createElement("i");
      icon.className = "fas fa-edit";
      const saveTxt = document.createTextNode("Save");
      const editTxt = document.createTextNode("Edit");

      if (editBtn.textContent === "Save") {
        const noteTxt = noteTextArea!.value;

        const requestOptions = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.token}`,
          },
          body: JSON.stringify({ text: noteTxt }),
        };

        if (!noteContainer!.id) {
          /* Save note to a DB */
          fetch("/api/v1/notes", requestOptions).then(() =>
            this.checkSavedNotes()
          );
        } else {
          /* Update note in a DB */
          requestOptions.method = "PATCH";

          fetch(`/api/v1/notes/${noteContainer!.id}`, requestOptions).then(() =>
            this.checkSavedNotes()
          );
        }
        editBtn.textContent = "";
        img.classList.remove("hidden");
        editBtn.append(icon, editTxt);
      } else {
        editBtn.textContent = "";
        img.classList.add("hidden");
        editBtn.append(icon, saveTxt);
      }
    });

    textArea.addEventListener("input", (e) => {
      const { value } = e.target as HTMLInputElement;

      main.textContent = value;
    });

    return note;
  }
  /* Edit Button */
  /* Note buttons */
}

new App();
