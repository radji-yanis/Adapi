import pg from "pg";
import "dotenv/config"; // charge les variables du .env dans process.env

const { Pool } = pg; // pg exporte tout en un seul objet, on en extrait Pool

// Pool = un gestionnaire de connexions réutilisable vers PostgreSQL
// une seule instance, exportée pour être utilisée dans toutes les routes
export const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
});