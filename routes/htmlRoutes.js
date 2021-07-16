// DEPENDENCIES
const path = require("path");

// ROUTING
module.exports = (app) => {
  // => HTML Get Requests

  app.get("/index", (req, res) => {
    res.sendFile(path.join(__dirname, "../Develop/public/index.html"));
  });

  app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "../Develop/public/notes.html"));
  });

  // If no matching route is found, default to home
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../Develop/public/index.html"));
  });

};// end of module.exports
