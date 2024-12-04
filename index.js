const express = require("express");
const path = require("path");
const fs = require("fs");
const app = express();
const port = 3008;

// Serve the release files
const releaseFolder = path.join(__dirname, "releases");

// Serve the update metadata (e.g., JSON)
app.get("/latest", (req, res) => {
  const releaseFile = path.join(releaseFolder, "latest.json");

  // Check if the release file exists and send its content
  if (fs.existsSync(releaseFile)) {
    const releaseData = fs.readFileSync(releaseFile);
    res.setHeader("Content-Type", "application/json");
    res.send(releaseData);
  } else {
    res.status(404).send({ error: "No release found" });
  }
});

// Serve the release files (e.g., executables, zip files)
app.get("/releases/:filename", (req, res) => {
  const filePath = path.join(releaseFolder, req.params.filename);

  // Check if the file exists
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).send({ error: "File not found" });
  }
});

// Optional: Endpoint for uploading new releases
// Make sure to add security checks and validation here
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

app.post("/upload", upload.single("file"), (req, res) => {
  const file = req.file;
  const filePath = path.join(releaseFolder, file.originalname);

  // Move file from temporary upload to the release folder
  fs.renameSync(file.path, filePath);

  // Update latest release metadata (this example assumes the uploaded file is the latest)
  const releaseData = {
    version: file.originalname.split("-")[0], // Extract version from file name (e.g., '1.0.0')
    url: `/releases/${file.originalname}`,
  };

  fs.writeFileSync(
    path.join(releaseFolder, "latest.json"),
    JSON.stringify(releaseData)
  );

  res.send({ message: "Release uploaded successfully", data: releaseData });
});

// Start the server
app.listen(port, () => {
  console.log(`Update server running at http://localhost:${port}`);
});
