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

// démarre le serveur sur le port défini dans .env
app.listen(process.env.PORT, () => console.log("je suis connecté"));


// app.get("/api/categories",(req,res)=>{
//     res.json({libelle:"Mobilier"})
// })

// app.get("/api/objets",(req,res)=>{
//     res.json({libelle:"Jeu de tournevis"})
// })

// app.get("/api/objets/:id"),(req,res)=>{
//     res.json({id:3})
// }

// app.get("/api/depots/:id"),(req,res)=>{
//     res.json({id:9})
// }

// app.get("/:id",(req,res)=> {
//     if (Number(req.params.id) === 2) {
//         res.status(404).send("erreur, je ne veux pas de ce chiffre")
//     }
//     res.send("hello world")
// });

// app.listen(3000,() =>console.log("je suis connecter"))

// import { objets } from "./tp.js";

// app.get("/:id",(req,res) => {
//     const idObjet = Number(req.params.id)
//     const found = objets.find((objet) => idObjet === objet.id )
//     res.json(found)
// })


// app.listen(3000,()=> console.log("je suis connecter"))


// ── Le middleware d'erreur ──────────────────────────────────────────

app.use((err, req, res, suite) => {
  console.error(err);                                   // le détail de l'erreur reste ici
  res.status(500).json({ erreur: 'Erreur interne du serveur' });  // le client reçoit un message propre
});