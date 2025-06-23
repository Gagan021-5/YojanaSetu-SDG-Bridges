import { Router } from "express";
const Schemarouter = Router();
import fs from "fs";
const schemes = JSON.parse(fs.readFileSync("./data/schemes.json", "utf8"));

//In website 
Schemarouter.post("/", (req, res) => {
  const { income, caste, occupation, gender } = req.body;
  const matches = schemes.filter((scheme) => {
    const e = scheme.eligibility;
    return (
      (!e.income || income <= e.income) &&
      (!e.caste || e.caste === caste) &&
      (!e.occupation || e.occupation === occupation) &&
      (!e.gender || e.gender === gender)
    );
  });
  res.json(matches.slice(0, 3));
});

export default Schemarouter;
