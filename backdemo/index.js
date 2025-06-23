import express from "express";
const app = express();
import "dotenv/config";
import cors from "cors";
const PORT = process.env.PORT;
import bodyParser from "body-parser";

app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Welcome Under the hood of YogaSetu!");
});

//Routers
import Schemarouter from "./routes/matchSchemes.js";
import smsroute from "./routes/sms.js";
app.use("/match-schemes", Schemarouter);
app.use("/sms", smsroute);

app.listen(PORT, () => {
  console.log(`App is listening at the port ${PORT}`);
});
