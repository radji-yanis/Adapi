import express from "express";
import "dotenv/config"; // charge les variables du .env
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./swagger.json" with { type: "json" };
import { router as categoriesRouter } from "./routes/categories.js"; // on renomme router pour éviter les doublons entre fichiers de routes
import { router as objetsRouter } from "./routes/objets.js";
import { router as personnesRouter } from "./routes/personnes.js";
import { router as depotsRouter } from "./routes/depots.js";
import { router as statsRouter } from  "./routes/stats.js";
const app = express();
app.use(express.json())
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// on branche le router des catégories sur le préfixe /api/categories
app.use("/api/categories", categoriesRouter);
app.use("/api/objets", objetsRouter);
app.use("/api/personnes", personnesRouter);
app.use("/api/depots", depotsRouter);
app.use("/api/stats", statsRouter)


 



// ── Le middleware d'erreur ──────────────────────────────────────────

app.use((req, res) => res.status(404).json({ erreur: "Route inconnue" }));

app.use((err, req, res, suite) => {
  console.error(err);                                   // le détail de l'erreur reste ici
  res.status(500).json({ erreur: 'Erreur interne du serveur' });  // le client reçoit un message propre
});

// démarre le serveur sur le port défini dans .env
app.listen(process.env.PORT, () => console.log("je suis connecté"));