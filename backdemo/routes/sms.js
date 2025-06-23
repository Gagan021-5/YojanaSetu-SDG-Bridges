import { Router } from "express";
const smsroute = Router();
// telecom to server 
smsroute.post("/", (req, res) => {
  const incomingresponse = req.body.Body?.toLowerCase() || "";
  let reply = "Send 'SCHEME FARMER' or 'SCHEME WOMEN' to get scheme info.";
  if (incomingresponse.includes("farmer")) {
    reply = "Top Schemes: PM-KISAN, Kisan Credit Card";
  } else if (incomingresponse.includes("women")) {
    reply = "Top Schemes: Ujjwala Yojana, Beti Bachao";
  }
  res.set("Content-Type", "text/xml");
  res.send(`<Response><Message>${reply}</Message></Response>`);
});

export default smsroute;
