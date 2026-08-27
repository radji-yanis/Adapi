import express from "express";
import { pool } from "../db.js";

export const router = express.Router();

router.get("/:id", async (req, res)=>{
  const { rows } = await pool.query(
    `SELECT depot.id, personne.nom, array_agg(objet.libelle) AS objets 
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

  res.json(rows[0]); 
}
)

router.post("/", async (req, res) => {
  const { personne_id, date_depot, type } = req.body
  if (!personne_id|| !date_depot||!type) {
        return res.status(400).json({ erreur: "Champs obligatoires manquants" })
    }
    const TYPES = ["boutique", "domicile"];
  if (!TYPES.includes(type)) {
  return res.status(400).json({ erreur: `type doit valoir : ${TYPES.join(", ")}` });
}
  const { rows } = await pool.query(`INSERT INTO depot (date_depot, type, personne_id) 
    VALUES($1, $2, $3) RETURNING *`,
     [date_depot, type, personne_id]);
  res.status(201).json(rows[0]); 
});