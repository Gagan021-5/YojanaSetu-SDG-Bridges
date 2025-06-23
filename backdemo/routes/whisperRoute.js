import express from "express";
import multer from "multer";
import fs from "fs";
import axios from "axios";
import "dotenv/config";

const myvoiceapi = process.env.OPENAI;

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/", upload.single("audio"), async (req, res) => {
  const filePath = req.file.path;

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/audio/transcriptions",
      {
        file: fs.createReadStream(filePath),
        model: "whisper-1",
      },
      {
        headers: {
          Authorization: `Bearer ${myvoiceapi}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    const transcript = response.data.text;
    console.log("data is : ", transcript);

    let reply = "Sorry, no match found.";
    if (transcript.includes("farmer")) {
      reply = "Top schemes: PM-KISAN, Kisan Credit Card.";
    } else if (transcript.includes("women")) {
      reply = "Top schemes: Ujjwala Yojana, Beti Bachao.";
    }

    res.json({ transcript, reply });
  } catch (err) {
    console.error("❌ Whisper error:", err.response?.data || err.message);
    res.status(500).send("Whisper transcription failed");
  } finally {
    fs.unlinkSync(filePath);
  }
});

export default router;
