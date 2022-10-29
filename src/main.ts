type Note = {
  _id?: string;
  text?: string;
  __v?: number;
};

class App {
  appContainer: HTMLDivElement;
  notes: object[];
  constructor() {
    this.appContainer = document.getElementById("app") as HTMLDivElement;
    this.notes = [] as object[];

    this.checkSavedNotes();
  }

  async checkSavedNotes(): Promise<void | (() => object[])> {
    try {
      const response = await fetch("/api/v1/notes");
      const data = await response.json();
      this.notes = data.notes;
      this.appContainer.innerHTML = "";
      this.createAddButton();

      this.notes.forEach((note: Note) => {
        this.appContainer.appendChild(this.addNewNote(note.text, note._id));
      });
    } catch (error) {
      console.log(error);
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

  addNewNote(text = "", id = "") {
    const note = document.createElement("div") as HTMLDivElement;
    note.className = "note";
    note.id = id;

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

    deleteBtn.addEventListener("click", (e: MouseEvent) => {
      const targetId = (e.target as Element)!.closest(".note")!.id;

      try {
        fetch(`/api/v1/notes/${targetId}`, { method: "DELETE" }).then(() =>
          this.checkSavedNotes()
        );
      } catch (error) {
        console.log(error);
      }
    });

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

      if (editBtn.innerText === "Save") {
        const noteTxt = noteTextArea!.value;

        if (!noteContainer!.id) {
          /* Save note to a DB */
          const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: noteTxt }),
          };

          fetch("/api/v1/notes", requestOptions);
        } else {
          /* update note in a DB */
          const requestOptions = {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: noteTxt }),
          };

          fetch(`/api/v1/notes/${noteContainer!.id}`, requestOptions);
        }
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
    });

    return note;
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
