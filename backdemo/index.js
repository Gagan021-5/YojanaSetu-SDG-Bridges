import express from "express";
const app = express();
import "dotenv/config";
import cors from "cors";
const PORT = process.env.PORT || 6000; 

const allowedOrigins = [
  'http://localhost:5173', // local 
  'https://ysfrontend.onrender.com' // deployed 
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true, 
  })
);
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome Under the hood of YogaSetu!");
});

// Routers
import Schemarouter from "./routes/matchSchemes.js";
import smsroute from "./routes/sms.js";
import whisperrouter from "./routes/whisperRoute.js";
app.use("/match-schemes", Schemarouter);
app.use("/sms", smsroute);
app.use("/api/whisper", whisperrouter); // Mount Whisper route

app.listen(PORT, () => {
  console.log(`App is listening at the port ${PORT}`);
});
