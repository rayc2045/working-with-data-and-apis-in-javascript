const express = require("express");
const fs = require("fs");

const app = express(),
  port = 3000;

app.use(express.static(__dirname));
app.use(express.json({ limit: "1mb" }));

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});

app.post("/api", (req, res) => {
  const { latitude, longitude } = req.body;
  const filePath = "data/location.txt";
  const contentToAppend = `${latitude}, ${longitude}\n`;

  try {
    fs.appendFileSync(filePath, contentToAppend);
    console.log("Content successfully appended to the file synchronously!");
    res.json({
      status: "success",
      latitude,
      longitude,
    });
  } catch (err) {
    console.error("Error appending to file synchronously:", err);
  }
});
