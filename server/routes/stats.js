import express from "express";
import { pool } from "../db.js";

export const router = express.Router()

router.get("/", async (req, res)=>{
    const { rows: parStatut } = await pool.query (
        `SELECT COUNT(*) , statut
        FROM objet
        GROUP BY statut
        `
    )
    const {rows: poidsTotal} = await pool.query(
        `SELECT SUM(poids_kg) AS poids_total
         FROM objet`
    )
    const {rows: poidsDetourne} = await pool.query(
        `SELECT SUM(poids_kg) AS poids_detourne
        FROM objet
        WHERE statut != 'recycle' `
    ) 

    res.json({
        parStatut : parStatut,
        poidsTotal : poidsTotal,
        poidsDetourne : poidsDetourne
    })
})

