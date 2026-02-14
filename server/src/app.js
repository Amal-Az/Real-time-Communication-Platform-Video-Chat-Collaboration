import express from 'express';
import cors from 'cors';

const app = express();

// Middlewares de base
app.use(cors());
app.use(express.json());

// La route Healthcheck que tu as proposée
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    timestamp: new Date(),
    message: 'Le serveur est opérationnel'
  });
});

// Gestion d'erreur basique
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Quelque chose a cassé !');
});

export default app; // Crucial pour que server.js puisse l'importer