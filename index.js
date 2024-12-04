const express = require("express");
const path = require("path");
const fs = require("fs");
const app = express();
const port = 3008;

// Directory where your release files and update metadata are stored
const releaseFolder = path.join(__dirname, "releases");

// Serve the update metadata (latest.yml or latest.json)
app.get(
  "/platevoltage/FTP-releases/releases/latest/download/latest-linux.yml",
  (req, res) => {
    const releaseFile = path.join(releaseFolder, "latest-linux.yml");

    if (fs.existsSync(releaseFile)) {
      const releaseData = fs.readFileSync(releaseFile, "utf8");
      res.setHeader("Content-Type", "application/x-yaml");
      res.send(releaseData);
    } else {
      res.status(404).send({ error: "No release metadata found" });
    }
  }
);

// Serve the release files (e.g., my-app-v1.0.0.zip or my-app-v1.0.0.dmg)
app.get(
  "/platevoltage/FTP-releases/releases/latest/download/:filename",
  (req, res) => {
    const filePath = path.join(releaseFolder, req.params.filename);

    if (fs.existsSync(filePath)) {
      res.sendFile(filePath);
    } else {
      res.status(404).send({ error: "File not found" });
    }
  }
);

// Start the server
app.listen(port, () => {
  console.log(`Update server running at http://localhost:${port}`);
});
