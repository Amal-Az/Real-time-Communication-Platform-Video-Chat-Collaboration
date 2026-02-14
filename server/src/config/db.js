import pg from 'pg';
const { Pool } = pg;

// Les informations viennent de ton docker-compose.yml
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Petit test de connexion au démarrage
pool.on('connect', () => {
  console.log(' Base de données PostgreSQL connectée');
});

pool.on('error', (err) => {
  console.error(' Erreur inattendue sur le pool PostgreSQL', err);
});

export default pool;