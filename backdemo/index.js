import express from "express";
const app = express();
import "dotenv/config";
import cors from "cors";
const PORT = process.env.PORT || 6000;



const allowedOrigins = [
  "http://localhost:5173",
  "https://ysfrontend.onrender.com",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
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
app.use("/api/whisper", whisperrouter);

app.listen(PORT, () => {
  console.log(`App is listening at the port ${PORT}`);
});
