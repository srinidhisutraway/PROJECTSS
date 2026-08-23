const express = require("express");
const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const router = express.Router();

router.post("/", (req, res) => {
  const { code, language } = req.body;

  if (!code || !language) {
    return res.status(400).json({ output: "❌ Code or language missing" });
  }

  const tempDir = path.join(__dirname, "temp");
  if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

  const filename = language === "python" ? "temp.py" : "temp.js";
  const filePath = path.join(tempDir, filename);

  fs.writeFileSync(filePath, code);

  const command = language === "python" ? `python "${filePath}"` : `node "${filePath}"`;

  exec(command, { timeout: 5000 }, (err, stdout, stderr) => {
    fs.unlinkSync(filePath);

    if (err) return res.json({ output: stderr || err.message });

    res.json({ output: stdout || stderr });
  });
});

module.exports = router;
