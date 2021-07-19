// DEPENDENCIES
const express = require("express");
const fs = require("fs");
const { uid } = require("uid");

// VARIABLES
const data = fs.readFileSync("./Develop/db/db.json", "utf-8");
const noteList = JSON.parse(data);


// EXPRESS CONFIGURATION
const app = express();
const PORT = process.env.PORT || 5000;
const path = require("path");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// FUNCTIONS
// save note to list
function saveNotes(notes) {
  fs.writeFile(
    path.join(__dirname, "/Develop/db/db.json"),
    JSON.stringify(notes),
    (err) => (err ? console.err(err) : console.log("Note File Saved!"))
  );
}

// ROUTES

// HTML Routes
// root
app.get("/", (req, res) => {
  res.set("Content-Type", "text/html");
  res.sendFile(path.join(__dirname, "/Develop/public/index.html"));
});

// notes
app.get("/notes", (req, res) => {
  res.set("Content-Type", "text/html");
  res.sendFile(path.join(__dirname, "/Develop/public/notes.html"));
});



// Other Routes
// javascript
app.get("/assets/js/index.js", (req, res) =>
  res.sendFile(path.join(__dirname, "/Develop/public/assets/js/index.js"))
);

// css
app.get("/assets/css/styles.css", (req, res) => {
  res.set("Content-Type", "text/css");
  res.sendFile(path.join(__dirname, "/Develop/public/assets/css/styles.css"));
});

// API Routes
// get notes
app.get("/api/notes", (req, res) => {
  res.set("Content-Type", "application/json");
  res.sendFile(path.join(__dirname, "Develop/db/db.json"));
});

// if route not found
app.get("*", (req, res) => {
  res.set("Content-Type", "text/html");
  res.sendFile(path.join(__dirname, "/Develop/public/index.html"));
});

// create note ID
app.post("/api/notes", (req, res) => {
  let note = req.body;
  let newID = uid(4);
  note.id = newID;
  noteList.push(note);

  saveNotes(noteList);
  res.send(note);
});

// delete note
// uid is passed in from index.js line 68
app.delete("/api/notes/:uid", (req, res) => {
  for (let i = 0; i < noteList.length; i++) {
    if (noteList[i].id === req.params.uid) {
      noteList.splice(i, 1);
      console.log("Note Successfully Deleted!")
    }
  }
 saveNotes(noteList);
  res.end();
});


// LISTENER
app.listen(PORT, () => {
  console.log(`App listening on PORT: ${PORT}`);
});
