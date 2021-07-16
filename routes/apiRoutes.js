// DEPENDENCIES
const path = require("path");
/* const fs = require("fs"); */
/* const data = fs.readFileSync("../Develop/db/db.json", "utf-8"); */


// ROUTING
module.exports = (app) => {
  // => API Get Request

  app.get("/api/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "../Develop/db/db.json"));
  });
}; // end of module.exports


