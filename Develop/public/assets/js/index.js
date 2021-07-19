// FUNCTION LIST
// show -- Shows an element
// hide -- Hides an element
// getNotes -- Retrieves saved notes using GET api/notes
// saveNote -- Saves a new note using POST api/note
// deletesNote -- Deletes an existing note using DELETE api/notes
// renderActiveNote -- Hides save button when user clicks to enter new note also assigns value to noteTitle and noteText 
// handleNoteSave -- Creates new note object then calls getAndRenderNotes and renderActiveNote
// handleNoteDelete -- Deletes the clicked note
// handleNoteView -- Sets the activeNote and displays it
// handleNewNoteView -- Sets the activeNote to and empty object and allows the user to enter a new note
// handleRenderSaveBtn -- Hides save button if value exists in new note title and text
// renderNoteList -- Renders the list of note titles

// VARIABLES
let noteTitle;
let noteText;
let saveNoteBtn;
let newNoteBtn;
let noteList;

if (window.location.pathname === "/notes") {
  noteTitle = document.querySelector(".note-title");
  noteText = document.querySelector(".note-textarea");
  saveNoteBtn = document.querySelector(".save-note");
  newNoteBtn = document.querySelector(".new-note");
  noteList = document.querySelectorAll(".list-container .list-group");
}


// Shows an element
const show = (elem) => {
  elem.style.display = "inline";
}; // end show

// Hides an element
const hide = (elem) => {
  elem.style.display = "none";
}; // end hide

// activeNote is used to keep track of the note in the textarea
let activeNote = {};

// Retrieves saved notes using GET api/notes
const getNotes = () =>
  fetch("/api/notes", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }); // end getNotes

// Saves a new note using POST api/note
const saveNote = (note) =>
  fetch("/api/notes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(note),
    // note refers to the variable representing a new note
  }); // end saveNote

// Deletes an existing note using DELETE api/notes
// id is passed in from line 20
const deleteNote = (id) =>
// see line 83 in express.js
  fetch(`/api/notes/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  }); // end deleteNote

// Hides save button when user clicks into note title to enter data
// also assigns value to noteTitle and noteText
const renderActiveNote = () => {
  hide(saveNoteBtn);

  if (activeNote.id) {
    noteTitle.setAttribute("readonly", true);
    noteText.setAttribute("readonly", true);
    noteTitle.value = activeNote.title;
    noteText.value = activeNote.text;
  } else {
    noteTitle.removeAttribute("readonly");
    noteText.removeAttribute("readonly");
    noteTitle.value = "";
    noteText.value = "";
  }
}; // end renderActiveNote

// Creates new note object then calls getAndRenderNotes and renderActiveNote
const handleNoteSave = () => {
  const newNote = {
    title: noteTitle.value,
    text: noteText.value,
  };
  saveNote(newNote).then(() => {
    getAndRenderNotes();
    renderActiveNote();
  });
}; // end handleNoteSave

// Deletes the clicked note
const handleNoteDelete = (e) => {
  // Prevents the click listener for the list from being called when the button inside of it is clicked
  e.stopPropagation();

  // e is the click event
  const note = e.target;
  // gets the id of the clicked note
  const noteId = JSON.parse(note.parentElement.getAttribute("data-note")).id;

  if (activeNote.id === noteId) {
    activeNote = {};
  }

  // passes the note id to deletNoteFunction line 66
  deleteNote(noteId).then(() => {
    getAndRenderNotes();
    renderActiveNote();
  });
}; // end handleNoteDelete

// Sets the activeNote and displays it
const handleNoteView = (e) => {
  e.preventDefault();
  activeNote = JSON.parse(e.target.parentElement.getAttribute("data-note"));
  renderActiveNote();
}; // end handleNoteView

// Sets the activeNote to and empty object and allows the user to enter a new note
const handleNewNoteView = (e) => {
  activeNote = {};
  renderActiveNote();
}; // end handleNewNoteView

// Hides save button if value exists in new note title and text
const handleRenderSaveBtn = () => {
  if (!noteTitle.value.trim() || !noteText.value.trim()) {
    hide(saveNoteBtn);
  } else {
    show(saveNoteBtn);
  }
}; // end handleRenderSaveBtn

// Renders the list of note titles
const renderNoteList = async (notes) => {
  // notes is the object array containing the notes
  let jsonNotes = await notes.json();
  if (window.location.pathname === "/notes") {
    noteList.forEach((el) => (el.innerHTML = ""));
  }

  let noteListItems = [];

  // Returns HTML element with or without a delete button
  const createLi = (text, delBtn = true) => {
    const liEl = document.createElement("li");
    liEl.classList.add("list-group-item");

    const spanEl = document.createElement("span");
    spanEl.classList.add("list-item-title");
    spanEl.innerText = text;
    spanEl.addEventListener("click", handleNoteView);

    liEl.append(spanEl);

    if (delBtn) {
      const delBtnEl = document.createElement("i");
      delBtnEl.classList.add(
        "fas",
        "fa-trash-alt",
        "float-right",
        "text-danger",
        "delete-note"
      );
      delBtnEl.addEventListener("click", handleNoteDelete);

      liEl.append(delBtnEl);
    }

    return liEl;
  };

    if (jsonNotes.length === 0) {
    noteListItems.push(createLi("No saved Notes", false));
  }

  jsonNotes.forEach((note) => {
    const li = createLi(note.title);
    li.dataset.note = JSON.stringify(note);

    noteListItems.push(li);
  });

  if (window.location.pathname === "/notes") {
    noteListItems.forEach((note) => noteList[0].append(note));
  }
}; // end renderNoteList

// Gets notes from the db and renders them to the sidebar
const getAndRenderNotes = () => getNotes().then(renderNoteList);

if (window.location.pathname === "/notes") {
  saveNoteBtn.addEventListener("click", handleNoteSave);
  newNoteBtn.addEventListener("click", handleNewNoteView);
  noteTitle.addEventListener("keyup", handleRenderSaveBtn);
  noteText.addEventListener("keyup", handleRenderSaveBtn);
}

console.log("begin");
getAndRenderNotes();
