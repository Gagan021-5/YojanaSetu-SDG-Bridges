import express from "express";
import multer from "multer";
import fs from "fs";
import { exec } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

router.post("/", upload.single("audio"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No audio file uploaded" });
    }

    const filePath = path.resolve(req.file.path);
    console.log("🎤 Transcribing:", filePath);
    const normalizedPath = filePath.replace(/\\/g, "/");
    console.log("📁 File sent to Python:", normalizedPath);

    exec(`python3 transcriber.py "${filePath}"`, (err, stdout, stderr) => {
      //  deletion AFTER Python
      try {
        fs.unlinkSync(filePath);
        console.log("🗑 Deleted:", filePath);
      } catch (e) {
        console.error("File deletion failed:", e.message);
      }

      if (err) {
        console.error("Whisper error:", stderr);
        return res.status(500).json({ error: stderr });
      }

      const output = stdout.trim().split("|||");
      const language = output[0] || "unknown";
      const transcript = output[1] || "";

      console.log("📝 Transcript:", transcript);
      console.log("🌐 Detected Language:", language);

      let reply = "Sorry, no match found.";
      const lc = transcript.toLowerCase();

      if (lc.includes("farmer") || lc.includes("किसान")) {
        reply =
          language === "hi"
            ? "शीर्ष योजनाएँ: पीएम-किसान, किसान क्रेडिट कार्ड।"
            : "Top schemes: PM-KISAN, Kisan Credit Card.";
      } else if (lc.includes("women") || lc.includes("महिला")) {
        reply =
          language === "hi"
            ? "शीर्ष योजनाएँ: उज्ज्वला योजना, बेटी बचाओ योजना।"
            : "Top schemes: Ujjwala Yojana, Beti Bachao.";
      }

      res.json({ transcript, language, reply });
    });
  } catch (err) {
    console.error("Unexpected error:", err);
    res.status(500).json({ error: "Something went wrong." });
  }
});

export default router;
