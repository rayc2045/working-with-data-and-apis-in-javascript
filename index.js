import express from "express";
import path from "path";
import { fileURLToPath } from "url";
// import fs from "fs";
import fs from "fs/promises";
import { JSONFilePreset } from "lowdb/node";

(async () => {
  const app = express(),
    port = 3000,
    __filename = fileURLToPath(import.meta.url),
    __dirname = path.dirname(__filename);

  app.use(express.static(__dirname));
  app.use(express.json({ limit: "1mb" }));

  app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`);
  });

  await fs.mkdir(path.join(__dirname, "data"), { recursive: true });
  const defaultData = { logs: [] },
    db = await JSONFilePreset(
      path.join(__dirname, "data/logs.json"),
      defaultData,
    );

  app.get("/api/logs", async (req, res) => {
    await db.read();
    const { logs } = db.data;
    res.json(logs);
  });

  app.post("/api", async (req, res) => {
    const { latitude, longitude } = req.body;
    // const filePath = "data/location.txt";
    // const contentToAppend = `${latitude}, ${longitude}\n`;
    try {
      // fs.appendFileSync(filePath, contentToAppend);
      const timestamp = Date.now();
      await db.update(({ logs }) =>
        logs.push({
          timestamp,
          ...req.body,
        }),
      );
      res.json({
        status: "success",
        timestamp,
        latitude,
        longitude,
      });
    } catch (err) {
      console.error(err);
    }
  });
})();
