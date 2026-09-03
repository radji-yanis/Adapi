import express from "express";
import { pool } from "../db.js";

export const router = express.Router();

// GET /api/depots/:id - un dépôt, sa donatrice, et la liste des objets qu'il contient
router.get("/:id", async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      `SELECT depot.id, personne.nom, array_agg(objet.libelle) AS objets  -- array_agg regroupe tous les libellés d'objets en un seul tableau par dépôt
       FROM depot 
       JOIN personne ON personne.id = depot.personne_id 
       JOIN objet ON objet.depot_id = depot.id 
       WHERE depot.id = $1 
      GROUP BY depot.id, personne.nom`,
      [req.params.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ erreur: "Aucun depot" });
    }
    res.json(rows[0]); // un seul dépôt renvoyé, pas un tableau
  } catch (err) {
    next(err);
  }
});

// POST /api/depots - crée un dépôt
router.post("/", async (req, res, next) => {
  const { personne_id, date_depot, type } = req.body
  if (!personne_id || !date_depot || !type) {
    return res.status(400).json({ erreur: "Champs obligatoires manquants" })
  }
  // liste blanche : seules ces deux valeurs sont acceptées par l'enum type_depot en base
  const TYPES = ["boutique", "domicile"];
  if (!TYPES.includes(type)) {
    return res.status(400).json({ erreur: `type doit valoir : ${TYPES.join(", ")}` });
  }
  try {
    const { rows } = await pool.query(
      `INSERT INTO depot (date_depot, type, personne_id) 
      VALUES($1, $2, $3) RETURNING *`,
      [date_depot, type, personne_id]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    next(err);
  }
});

// POST /api/depots/:id/objets - ajoute un objet au dépôt
router.post("/:id/objets", async (req, res, next) => {
  const { libelle, poids_kg, etat_arrivee, categorie_id } = req.body
  const depot_id = req.params.id;
  if (!libelle || !categorie_id || !poids_kg || !etat_arrivee) {
    return res.status(400).json({ erreur: "Champs obligatoires manquants" })
  }
  const ETATS = ["bon_etat", "a_reparer", "hors_service"];
  if (!ETATS.includes(etat_arrivee)) {
    return res.status(400).json({ erreur: `etat_arrivee doit valoir : ${ETATS.join(", ")}` });
  }
  try {
    const { rows } = await pool.query(
      `INSERT INTO objet (libelle, poids_kg, etat_arrivee, categorie_id, depot_id) 
      VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [libelle, poids_kg, etat_arrivee, categorie_id, depot_id]
    )
    res.status(201).json(rows[0])
  } catch (err) {
    next(err);
  }
});