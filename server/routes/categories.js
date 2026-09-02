import express from "express";
import { pool } from "../db.js"; // le pool de connexion partagé

export const router = express.Router(); // mini-routeur dédié aux catégories

// GET /api/categories (le préfixe /api/categories est ajouté depuis index.js)
// renvoie toutes les catégories, id et libelle uniquement
router.get("/", async (req, res) => {
  const { rows } = await pool.query(
    `SELECT id, libelle 
    FROM categorie 
    ORDER BY id`
  );
  res.json(rows); // Express répond en JSON, statut 200 par défaut
});