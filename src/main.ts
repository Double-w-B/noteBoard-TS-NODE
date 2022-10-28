class App {
  appContainer: HTMLDivElement;
  notes: string[];
  constructor() {
    this.appContainer = document.getElementById("app") as HTMLDivElement;
    this.notes = JSON.parse(localStorage.getItem("notes")!) as string[];

    this.checkSavedNotes();
    this.createAddButton();
  }

  checkSavedNotes() {
    if (this.notes) {
      this.notes.forEach((note) =>
        this.appContainer.appendChild(this.addNewNote(note))
      );
    }
  }

  createAddButton() {
    const button = document.createElement("button") as HTMLButtonElement;
    button.className = "add";
    button.id = "add";
    const plusIcon = document.createElement("i");
    plusIcon.className = "fas fa-plus";
    button.appendChild(plusIcon);
    const textNode = document.createTextNode("Add note");
    button.appendChild(textNode);
    this.appContainer.appendChild(button);
    (this.notes === null || this.notes?.length < 1) &&
      button.classList.add("animation");
    button.addEventListener("click", () => {
      button.classList.remove("animation");
      this.appContainer.appendChild(this.addNewNote());
    });
  }

  addNewNote(text = "") {
    const note = document.createElement("div") as HTMLDivElement;
    note.className = "note";

    const tools = document.createElement("div") as HTMLDivElement;
    tools.className = "tools";

    const main = document.createElement("div") as HTMLDivElement;
    main.className = `${text ? "main" : "main hidden"}`;
    main.innerText = text;

    const textArea = document.createElement("textarea") as HTMLTextAreaElement;
    textArea.className = `${text ? "hidden" : ""}`;
    textArea.placeholder = "add your note here";
    textArea.autofocus = true;
    textArea.value = text;

    const img = document.createElement("img");
    img.src = "./assets/pin.png";
    !text && img.classList.add("hidden");

    tools.appendChild(img);
    tools.appendChild(
      new ToolButton(
        `${text ? "Edit" : "Save"}`,
        "edit",
        "fas fa-edit"
      ).createButton()
    );
    tools.appendChild(
      new ToolButton("Delete", "delete", "fas fa-trash-alt").createButton()
    );
    note.append(tools);
    note.appendChild(main);
    note.appendChild(textArea);

    const editBtn = note.querySelector(".edit") as HTMLButtonElement;
    const deleteBtn = note.querySelector(".delete") as HTMLButtonElement;

    deleteBtn.addEventListener("click", () => {
      note.remove();
      this.updateLS();

      const savedNotes = JSON.parse(localStorage.getItem("notes")!) as string[];
      const addButton = document.querySelector(".add");
      if (savedNotes.length < 1) {
        addButton!.classList.add("animation");
      }
    });

    editBtn.addEventListener("click", () => {
      if (!textArea.value.trim()) return;

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
      } else {
        editBtn.innerText = "";
        img.classList.add("hidden");
        editBtn.appendChild(icon);
        editBtn.appendChild(saveTxt);
      }
    });

    textArea.addEventListener("input", (e) => {
      const { value } = e.target as HTMLInputElement;

      main.innerText = value;
      this.updateLS();
    });

    return note;
  }

  updateLS() {
    const notesText = document.querySelectorAll("textarea");
    const notes: string[] = [];

    notesText.forEach((note) => note.value.trim() && notes.push(note.value));

    localStorage.setItem("notes", JSON.stringify(notes));
  }
}

class ToolButton {
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
    button.appendChild(icon);
    button.appendChild(textNode);
    return button;
  }
}

new App();
