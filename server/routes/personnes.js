import express from "express";
import { pool } from "../db.js";

export const router = express.Router();

// POST /api/personnes - crée une donatrice
router.post("/", async (req, res, next) => {
  const {nom, prenom, telephone, adherente} = req.body
  if (!nom || !prenom) {
    return res.status(400).json({ erreur: "Champs obligatoires manquants" })
  }
  try {
    const { rows } = await pool.query(
      `INSERT INTO personne (nom, prenom, telephone, adherente) 
       VALUES($1, $2, $3, COALESCE($4, false)) -- si adherente n'est pas fourni, on insère false (colonne NOT NULL sans DEFAULT en base)
       RETURNING *`,
       [nom, prenom, telephone, adherente]);
    res.status(201).json(rows[0]); 
  } catch (err) {
    next(err);
  }
});